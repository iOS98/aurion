/* طبقة السحابة — نسخة خاصة بهذا التطبيق فقط.
 * - ما ينحفظ أي شي في الجهاز: البيانات تنقرأ من السحابة وتبقى في الذاكرة لين ينقفل التطبيق.
 * - كل شي يتشفّر في الجهاز قبل ما يطلع (AES-256-GCM) بمفتاح مشتق من رمز الدخول
 *   (PBKDF2-SHA256 ثم HKDF)، والخادم ما يشوف لا الرمز ولا المفتاح ولا البيانات.
 * - أول فتح بعد التحديث: ينقل بيانات النسخة القديمة من الجهاز للسحابة، يتأكد إنها وصلت
 *   كاملة (يقراها من السحابة ويقارنها)، وبعدها بس يمسحها من الجهاز.
 */
(function () {
  'use strict';
  const te = new TextEncoder(), td = new TextDecoder();
  const ITER = 310000;
  const STATE_ID = 'state';

  let cfg = null;
  let encKey = null, token = null;
  let stateVersion = 0, stateObj = null;
  let dirty = false, saving = null, saveTimer = null, retryTimer = null, lastActivity = Date.now();
  let hiddenAt = 0;

  // ---------- أدوات ----------
  const b64 = u8 => { let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); };
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const hex = u8 => [...u8].map(b => b.toString(16).padStart(2, '0')).join('');
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  async function deriveKeys(passcode, saltB64, iter) {
    const base = await crypto.subtle.importKey('raw', te.encode(passcode.normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);
    const master = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unb64(saltB64), iterations: iter }, base, 256);
    const hk = await crypto.subtle.importKey('raw', master, 'HKDF', false, ['deriveBits', 'deriveKey']);
    const key = await crypto.subtle.deriveKey({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: te.encode('enc:' + cfg.app) }, hk, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    const auth = new Uint8Array(await crypto.subtle.deriveBits({ name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(0), info: te.encode('auth:' + cfg.app) }, hk, 256));
    return { key, token: hex(auth) };
  }

  async function gzip(u8, mode) {
    if (typeof CompressionStream === 'undefined') return null;
    const s = new Blob([u8]).stream().pipeThrough(mode === 'c' ? new CompressionStream('gzip') : new DecompressionStream('gzip'));
    return new Uint8Array(await new Response(s).arrayBuffer());
  }

  // الصيغة: [1 إصدار][1 أعلام: 1=مضغوط][12 IV][نص مشفّر]. معرّف العنصر يدخل كـ AAD عشان ما ينبدل ملف بملف.
  async function seal(id, u8, compress, key) {
    let flags = 0, body = u8;
    if (compress) { const z = await gzip(u8, 'c'); if (z && z.length < u8.length) { body = z; flags = 1; } }
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: te.encode(id) }, key || encKey, body));
    const out = new Uint8Array(14 + ct.length);
    out[0] = 1; out[1] = flags; out.set(iv, 2); out.set(ct, 14);
    return out;
  }
  async function open(id, u8, key) {
    if (u8[0] !== 1) throw new Error('صيغة غير معروفة');
    const pt = new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: u8.subarray(2, 14), additionalData: te.encode(id) }, key || encKey, u8.subarray(14)));
    return u8[1] & 1 ? gzip(pt, 'd') : pt;
  }

  async function api(path, opts = {}) {
    const headers = Object.assign({}, opts.headers || {});
    if (token) headers.Authorization = 'Bearer ' + token;
    let res;
    try { res = await fetch(cfg.api + path, { method: opts.method || 'GET', headers, body: opts.body, cache: 'no-store', mode: 'cors', credentials: 'omit' }); }
    catch (e) { const err = new Error('offline'); err.code = 'offline'; throw err; }
    if (!res.ok) {
      let j = {}; try { j = await res.json(); } catch (e) { }
      const err = new Error(j.error || ('http_' + res.status)); err.code = j.error || ('http_' + res.status); err.status = res.status; err.data = j; throw err;
    }
    return res;
  }

  async function sha(u8) { return hex(new Uint8Array(await crypto.subtle.digest('SHA-256', u8))); }

  // ---------- الحالة (كائن JSON واحد) ----------
  async function fetchState() {
    try {
      const r = await api('/api/blob/' + STATE_ID);
      const v = Number(r.headers.get('X-Version') || 0);
      const pt = await open(STATE_ID, new Uint8Array(await r.arrayBuffer()));
      return { version: v, obj: JSON.parse(td.decode(pt)) };
    } catch (e) {
      if (e.status === 404) return { version: 0, obj: null };
      throw e;
    }
  }
  async function putState(obj, expected) {
    const sealed = await seal(STATE_ID, te.encode(JSON.stringify(obj)), true);
    const r = await api('/api/blob/' + STATE_ID, { method: 'PUT', body: sealed, headers: { 'Content-Type': 'application/octet-stream', 'If-Match': String(expected) } });
    return (await r.json()).version;
  }

  // ---------- واجهة القفل ----------


  let root = null, pill = null;
  function mount() {
    if (!document.getElementById('cg-style')) { const l = document.createElement('link'); l.id = 'cg-style'; l.rel = 'stylesheet'; l.href = 'cloud.css'; document.head.appendChild(l); }
    if (!root) { root = document.createElement('div'); root.className = 'cg-wrap'; if (cfg.accent) root.style.setProperty('--cg-accent', cfg.accent); document.body.appendChild(root); }
    root.hidden = false;
    return root;
  }
  function card(html) {
    mount().innerHTML = `<form class="cg-card" autocomplete="off" novalidate>${cfg.icon ? `<img src="${cfg.icon}" alt="">` : ''}<h1>${cfg.title}</h1>${html}</form>`;
    return root.querySelector('form');
  }
  function unmount() { if (root) { root.remove(); root = null; } }
  function setPill(text, bad, sticky) {
    if (!pill) { pill = document.createElement('div'); pill.className = 'cg-pill'; pill.setAttribute('role', 'status'); document.body.appendChild(pill); }
    pill.textContent = text; pill.classList.toggle('bad', !!bad); pill.classList.add('on');
    clearTimeout(pill._t); if (!sticky) pill._t = setTimeout(() => pill.classList.remove('on'), 1600);
  }
  function errText(e) {
    if (!e) return '';
    if (e.code === 'offline') return 'ما فيه اتصال بالإنترنت. تأكد من الاتصال وحاول مرة ثانية.';
    if (e.code === 'unauthorized') return 'الرمز غلط.';
    if (e.code === 'locked') return `محاولات كثيرة. جرّب بعد ${Math.ceil((e.data.retryAfter || 900) / 60)} دقيقة.`;
    if (e.code === 'origin') return 'هذا الرابط غير مسموح له بالوصول للبيانات.';
    if (e.code === 'bad_passcode') return 'الرمز ما يطابق رمز النسخة القديمة.';
    if (e.code === 'bad_old') return 'الرمز الحالي غلط.';
    if (e.code === 'short') return 'الرمز الجديد لازم يكون 6 خانات أو أكثر.';
    return 'صار خطأ: ' + (e.message || e);
  }

  function ask(form) {
    return new Promise(resolve => {
      form.addEventListener('submit', ev => { ev.preventDefault(); resolve(ev.submitter && ev.submitter.value); });
      const i = form.querySelector('input'); if (i) setTimeout(() => i.focus(), 50);
    });
  }

  // ---------- تذكّر الجهاز: مفتاح التشفير (غير قابل للاستخراج) + مفتاح الدخول في IndexedDB ----------
  // البيانات نفسها ما تنحفظ في الجهاز؛ بس المفتاح عشان ما يطلب الرمز كل مرة
  function devDb() {
    return new Promise((res, rej) => { const r = indexedDB.open('cloud-device-' + cfg.app, 1); r.onupgradeneeded = () => r.result.createObjectStore('k'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  }
  async function devTx(mode, fn) {
    const db = await devDb();
    try { return await new Promise((res, rej) => { const t = db.transaction('k', mode); const r = fn(t.objectStore('k')); t.oncomplete = () => res(r && r.result); t.onerror = () => rej(t.error); }); }
    finally { db.close(); }
  }
  const devLoad = () => cfg.remember ? devTx('readonly', st => st.get('device')).catch(() => null) : Promise.resolve(null);
  const devSave = () => cfg.remember ? devTx('readwrite', st => st.put({ key: encKey, token }, 'device')).catch(() => { }) : Promise.resolve();
  const devClear = () => devTx('readwrite', st => st.delete('device')).catch(() => { });

  // ---------- الدخول + النقل من النسخة القديمة ----------
  async function gate() {
    let meta;
    for (;;) {
      try { meta = await (await api('/api/meta')).json(); break; }
      catch (e) {
        const f = card(`<p>${errText(e)}</p><button class="cg-btn" value="retry">إعادة المحاولة</button>`);
        await ask(f);
        card('<p>جاري الاتصال…</p>');
      }
    }

    const legacyInfo = cfg.legacy && cfg.legacy.exists ? await cfg.legacy.exists() : null; // {encrypted:bool} أو null

    if (!meta.setup) {
      // أول مرة: إنشاء رمز السحابة (ولو فيه نسخة قديمة مشفّرة، نستخدم نفس رمزها)
      const reuse = legacyInfo && legacyInfo.encrypted;
      for (;;) {
        const f = card(reuse
          ? `<p>بيانات التطبيق بتنتقل للسحابة بشكل مشفّر. اكتب رمز الدخول الحالي، وبيصير هو نفسه رمز السحابة.</p><input type="password" name="p1" placeholder="رمز الدخول الحالي" autocomplete="current-password"><div class="cg-err"></div><button class="cg-btn" value="go">متابعة</button>`
          : `<p>${legacyInfo ? 'بيانات هذا الجهاز بتنتقل للسحابة بشكل مشفّر. ' : ''}اختر رمز دخول (6 خانات أو أكثر). البيانات تتشفّر فيه، ولو نسيته ما تنفتح.</p><input type="password" name="p1" placeholder="رمز الدخول" autocomplete="new-password"><input type="password" name="p2" placeholder="أعد كتابة الرمز" autocomplete="new-password"><div class="cg-err"></div><button class="cg-btn" value="go">إنشاء</button>`);
        await ask(f);
        const p1 = f.p1.value, p2 = f.p2 ? f.p2.value : p1;
        const er = f.querySelector('.cg-err');
        if (p1.length < (reuse ? 1 : 6)) { er.textContent = 'الرمز لازم يكون 6 خانات أو أكثر.'; continue; }
        if (p1 !== p2) { er.textContent = 'الرمزين مو متطابقين.'; continue; }
        card('<p>جاري التجهيز…</p>');
        try {
          let legacy = null;
          if (legacyInfo) legacy = await cfg.legacy.read(p1);   // يرمي bad_passcode لو الرمز غلط
          const salt = b64(crypto.getRandomValues(new Uint8Array(16)));
          const k = await deriveKeys(p1, salt, ITER);
          await api('/api/setup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ salt, iter: ITER, token: k.token }) });
          encKey = k.key; token = k.token;
          stateVersion = 0; stateObj = null;
          await devSave();
          if (legacy) await migrate(legacy);
          return;
        } catch (e) {
          if (e.code === 'already_setup') { return gate(); }
          const f2 = card(`<div class="cg-err">${errText(e)}</div><button class="cg-btn" value="retry">رجوع</button>`); await ask(f2);
        }
      }
    }

    // جهاز متذكَّر: ندخل مباشرة بدون رمز
    const dev = meta.setup ? await devLoad() : null;
    if (dev && dev.key && dev.token) {
      card('<p>جاري الفتح…</p>');
      try {
        token = dev.token;
        await api('/api/check');
        encKey = dev.key;
        const s = await fetchState();
        stateVersion = s.version; stateObj = s.obj;
        return;
      } catch (e) {
        token = null; encKey = null;
        if (e.status === 401 || e.code === 'unauthorized' || e.code === 'bad_passcode') await devClear();   // تغيّر الرمز من جهاز ثاني
        else { const f2 = card(`<p>${errText(e)}</p><button class="cg-btn" value="retry">إعادة المحاولة</button>`); await ask(f2); return gate(); }
      }
    }

    // التطبيق مهيأ: إدخال الرمز
    for (;;) {
      const f = card(`<p>اكتب رمز الدخول</p><input type="password" name="p1" placeholder="رمز الدخول" autocomplete="current-password"><div class="cg-err"></div><button class="cg-btn" value="go">دخول</button><div class="cg-note">البيانات محفوظة في السحابة ومشفّرة برمزك.</div>`);
      await ask(f);
      const p = f.p1.value; if (!p) continue;
      card('<p>جاري الدخول…</p>');
      try {
        const k = await deriveKeys(p, meta.salt, meta.iter);
        token = k.token;
        await api('/api/check');
        encKey = k.key;
        const s = await fetchState();
        stateVersion = s.version; stateObj = s.obj;
        await devSave();
        if (legacyInfo) await legacyOnSecondDevice(p);
        return;
      } catch (e) {
        token = null; encKey = null;
        const f2 = card(`<div class="cg-err">${errText(e)}</div><button class="cg-btn" value="retry">حاول مرة ثانية</button>`); await ask(f2);
      }
    }
  }

  async function migrate(legacy) {
    card('<p>جاري نقل بياناتك للسحابة…</p><p class="cg-note" id="cg-prog"></p>');
    const prog = t => { const n = document.getElementById('cg-prog'); if (n) n.textContent = t; };
    // 1) الملفات أولًا
    const files = legacy.files || [];
    let i = 0;
    for (const fl of files) {
      prog(`الملفات ${++i} من ${files.length}`);
      const u8 = fl.data instanceof Uint8Array ? fl.data : new Uint8Array(await new Response(fl.data).arrayBuffer());
      await putFileRaw(fl.id, u8, null);
      const back = await getFileRaw(fl.id);
      if (await sha(back) !== await sha(u8)) throw new Error('تحقق الملف ' + fl.id + ' فشل');
    }
    // 2) البيانات
    prog('البيانات');
    try { stateVersion = await putState(legacy.state, stateVersion); }
    catch (e) { if (e.code !== 'conflict') throw e; stateVersion = (await fetchState()).version; stateVersion = await putState(legacy.state, stateVersion); }
    const back = await fetchState();
    if (JSON.stringify(back.obj) !== JSON.stringify(legacy.state)) throw new Error('تحقق البيانات فشل');
    stateObj = back.obj; stateVersion = back.version;
    // 3) بعد التأكد: مسح النسخة المحلية
    prog('تنظيف الجهاز');
    await cfg.legacy.clear();
    setPill('انتقلت بياناتك للسحابة ✓', false, false);
  }

  // جهاز ثاني فيه نسخة قديمة، والسحابة فيها بيانات أصلًا
  async function legacyOnSecondDevice(passcode) {
    let legacy = null;
    try { legacy = await cfg.legacy.read(passcode); }
    catch (e) {
      // النسخة القديمة مشفّرة برمز ثاني: نطلبه، وما نمسح شي من الجهاز بدونه
      for (;;) {
        const f = card(`<p>هذا الجهاز فيه بيانات من النسخة القديمة مشفّرة برمز مختلف عن رمز السحابة. اكتب رمز النسخة القديمة عشان تنتقل.</p><input type="password" name="p1" placeholder="رمز النسخة القديمة" autocomplete="off"><div class="cg-err"></div><button class="cg-btn" value="go">نقل البيانات</button><button class="cg-btn sec" value="later">بعدين (تبقى في الجهاز)</button>`);
        const v = await ask(f);
        if (v === 'later') return;
        try { legacy = await cfg.legacy.read(f.p1.value); break; }
        catch (e2) { const f2 = card(`<div class="cg-err">${errText(e2.code ? e2 : { code: 'bad_passcode' })}</div><button class="cg-btn" value="retry">حاول مرة ثانية</button>`); await ask(f2); }
      }
    }
    if (!legacy) return;
    if (!stateObj || (cfg.isEmpty && cfg.isEmpty(stateObj))) { await migrate(legacy); return; }
    const f = card(`<p>هذا الجهاز فيه بيانات من النسخة القديمة، والسحابة فيها بيانات أصلًا.</p>
      ${legacy && cfg.legacy.download ? '<button class="cg-btn sec" value="dl">نزّل نسخة من بيانات هذا الجهاز</button>' : ''}
      <button class="cg-btn" value="cloud">اعتمد السحابة وامسح نسخة الجهاز</button>
      ${legacy ? '<button class="cg-btn sec" value="local">ارفع نسخة الجهاز بدل السحابة</button>' : ''}
      <button class="cg-btn sec" value="later">قرر بعدين</button>`);
    for (;;) {
      const v = await ask(f);
      if (v === 'dl') { await cfg.legacy.download(legacy); continue; }
      if (v === 'cloud') { await cfg.legacy.clear(); return; }
      if (v === 'local') { stateVersion = await putState(legacy.state, stateVersion); for (const fl of legacy.files || []) await putFileRaw(fl.id, new Uint8Array(await new Response(fl.data).arrayBuffer()), null); stateObj = (await fetchState()).obj; await cfg.legacy.clear(); return; }
      return;
    }
  }

  // ---------- الحفظ ----------
  function scheduleSave() {
    dirty = true; setPill('يحفظ…', false, true);
    clearTimeout(saveTimer); saveTimer = setTimeout(flush, cfg.saveDelay || 700);
  }
  async function flush() {
    clearTimeout(saveTimer);
    if (!dirty) return saving;
    if (saving) { await saving; return flush(); }
    dirty = false;
    const snapshot = stateObj;
    saving = (async () => {
      try {
        stateVersion = await putState(snapshot, stateVersion);
        if (!dirty) setPill('انحفظ ✓');
      } catch (e) {
        if (e.code === 'conflict') { await onConflict(); return; }
        dirty = true;
        setPill(e.code === 'offline' ? 'غير محفوظ — ما فيه اتصال' : 'غير محفوظ — بيعيد المحاولة', true, true);
        clearTimeout(retryTimer); retryTimer = setTimeout(flush, 4000);
      }
    })();
    try { await saving; } finally { saving = null; }
  }
  async function onConflict() {
    const remote = await fetchState();
    const f = card(`<p>البيانات تعدّلت من جهاز ثاني بعد ما فتحتها هنا.</p>
      <button class="cg-btn" value="remote">اعرض نسخة الجهاز الثاني</button>
      <button class="cg-btn sec" value="mine">احفظ نسختي فوقها</button>`);
    const v = await ask(f);
    unmount();
    if (v === 'mine') { stateVersion = remote.version; dirty = true; await flush(); }
    else { stateVersion = remote.version; stateObj = remote.obj; dirty = false; cfg.onRemote && cfg.onRemote(stateObj); setPill('تحدّثت البيانات'); }
  }

  // ---------- الملفات ----------
  async function putFileRaw(id, u8, expected) {
    const sealed = await seal('f:' + id, u8, false);
    await api('/api/blob/' + encodeURIComponent('f.' + id), { method: 'PUT', body: sealed, headers: { 'Content-Type': 'application/octet-stream', 'If-Match': expected == null ? '*' : String(expected) } });
  }
  async function getFileRaw(id) {
    const r = await api('/api/blob/' + encodeURIComponent('f.' + id));
    return open('f:' + id, new Uint8Array(await r.arrayBuffer()));
  }


  // ---------- تغيير رمز الدخول ----------
  const aadFor = sid => sid === STATE_ID ? STATE_ID : 'f:' + sid.slice(2);
  async function changePasscode(oldPass, newPass, progress) {
    if (newPass.length < 6) { const e = new Error('short'); e.code = 'short'; throw e; }
    await flush();
    const meta = await (await api('/api/meta')).json();
    const oldK = await deriveKeys(oldPass, meta.salt, meta.iter);
    if (oldK.token !== token) { const e = new Error('bad_old'); e.code = 'bad_old'; throw e; }
    let items = (await (await api('/api/list')).json()).items;
    for (const it of items.filter(x => x.id.startsWith('n.'))) await api('/api/blob/' + encodeURIComponent(it.id), { method: 'DELETE' });
    items = items.filter(x => !x.id.startsWith('n.'));
    const salt = b64(crypto.getRandomValues(new Uint8Array(16)));
    const newK = await deriveKeys(newPass, salt, ITER);
    let i = 0;
    for (const it of items) {
      progress && progress(++i, items.length);
      const r = await api('/api/blob/' + encodeURIComponent(it.id));
      const aad = aadFor(it.id);
      const pt = await open(aad, new Uint8Array(await r.arrayBuffer()), oldK.key);
      const sealed = await seal(aad, pt, it.id === STATE_ID, newK.key);
      await api('/api/blob/' + encodeURIComponent('n.' + it.id), { method: 'PUT', body: sealed, headers: { 'Content-Type': 'application/octet-stream', 'If-Match': '*' } });
    }
    await api('/api/rekey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ salt, iter: ITER, token: newK.token }) });
    token = newK.token; encKey = newK.key;
    await devSave();
    const s = await fetchState(); stateVersion = s.version;
  }

  // ---------- القفل التلقائي ----------
  async function lock() {
    if (dirty || saving) { try { await flush(); } catch (e) { } }
    if (dirty) return;               // ما انحفظ: لا تقفل وتضيّع التعديل
    encKey = null; token = null; stateObj = null;
    await devClear();               // القفل اليدوي = نسيان هذا الجهاز
    location.reload();
  }
  function watchIdle() {
    const idle = (cfg.idleMinutes || 10) * 60000, away = (cfg.awayMinutes || 5) * 60000;
    ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(ev => addEventListener(ev, () => { lastActivity = Date.now(); }, { passive: true }));
    document.addEventListener('visibilitychange', async () => {
      if (document.hidden) { hiddenAt = Date.now(); if (dirty) flush(); return; }
      if (!cfg.remember && hiddenAt && Date.now() - hiddenAt > away) return lock();
      // رجعت للتطبيق: لو تغيّرت البيانات من جهاز ثاني ونسختي محفوظة، حدّث
      if (!dirty && !saving && token) {
        try { const s = await fetchState(); if (s.version !== stateVersion) { stateVersion = s.version; stateObj = s.obj; cfg.onRemote && cfg.onRemote(stateObj); setPill('تحدّثت البيانات'); } } catch (e) { }
      }
    });
    if (!cfg.remember) setInterval(() => { if (Date.now() - lastActivity > idle && !dirty) lock(); }, 30000);
    addEventListener('beforeunload', e => { if (dirty || saving) { e.preventDefault(); e.returnValue = ''; } });
  }

  window.Cloud = {
    /** يبدأ التطبيق: يعرض شاشة الدخول، يحمّل البيانات، وينقل النسخة القديمة لو موجودة. يرجّع الحالة (أو null لو جديد). */
    async start(options) {
      cfg = options;
      await gate();
      unmount();
      watchIdle();
      return stateObj;
    },
    get state() { return stateObj; },
    /** احفظ الحالة كاملة (يتأخر شوي ويجمع التعديلات المتتالية) */
    save(obj) { if (obj !== undefined) stateObj = obj; scheduleSave(); },
    flush,
    lock,
    async putFile(id, data) { const u8 = data instanceof Uint8Array ? data : new Uint8Array(await new Response(data).arrayBuffer()); await putFileRaw(id, u8, null); },
    async getFile(id, type) { const u8 = await getFileRaw(id); return new Blob([u8], { type: type || 'application/octet-stream' }); },
    async deleteFile(id) { await api('/api/blob/' + encodeURIComponent('f.' + id), { method: 'DELETE' }); },
    changePasscode,
    message: errText,
    toast: setPill
  };
})();
