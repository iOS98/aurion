// خادم سحابي خاص بتطبيق واحد فقط — Cloudflare Worker + قاعدة D1 خاصة فيه.
// الخادم ما يشوف البيانات أبدًا: كل شي يوصله مشفّر من الجهاز برمز الدخول (AES-256-GCM).
// الخادم يتحقق بس من «مفتاح الدخول» المشتق من الرمز، ويحفظ بصمته (SHA-256) لا المفتاح نفسه.

const CHUNK = 1024 * 1024;          // حجم القطعة في قاعدة البيانات (حد D1 للصف 2MB)
const MAX_BLOB = 40 * 1024 * 1024;  // أكبر ملف مسموح
const LOCK_AFTER = 8;               // محاولات خاطئة قبل القفل المؤقت
const LOCK_MS = 15 * 60 * 1000;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS auth (id INTEGER PRIMARY KEY CHECK (id = 1), token_hash TEXT NOT NULL, salt TEXT NOT NULL, iter INTEGER NOT NULL, created INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS blob_meta (id TEXT PRIMARY KEY, version INTEGER NOT NULL, size INTEGER NOT NULL, chunks INTEGER NOT NULL, updated INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS blob_chunks (id TEXT NOT NULL, idx INTEGER NOT NULL, data BLOB NOT NULL, PRIMARY KEY (id, idx))`,
  `CREATE TABLE IF NOT EXISTS fails (ip TEXT PRIMARY KEY, n INTEGER NOT NULL, until INTEGER NOT NULL)`
];
const schemaReady = new WeakSet();
async function ensureSchema(db) {
  if (schemaReady.has(db)) return;
  await db.batch(SCHEMA.map(s => db.prepare(s)));
  schemaReady.add(db);
}

function cors(env, req) {
  const origin = req.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const h = {
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, If-Match',
    'Access-Control-Expose-Headers': 'ETag, X-Version',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
  if (allowed.includes(origin)) h['Access-Control-Allow-Origin'] = origin;
  return { h, ok: allowed.includes(origin) };
}

const SEC = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=31536000'
};

function json(data, status, extra) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: { 'Content-Type': 'application/json; charset=utf-8', ...SEC, ...extra } });
}

async function sha256Hex(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function checkAuth(env, req) {
  const ip = req.headers.get('CF-Connecting-IP') || 'x';
  const now = Date.now();
  const f = await env.DB.prepare('SELECT n, until FROM fails WHERE ip = ?').bind(ip).first();
  if (f && f.until > now) return { err: json({ error: 'locked', retryAfter: Math.ceil((f.until - now) / 1000) }, 429) };
  const row = await env.DB.prepare('SELECT token_hash FROM auth WHERE id = 1').first();
  if (!row) return { err: json({ error: 'not_setup' }, 409) };
  const m = /^Bearer ([a-f0-9]{64})$/.exec(req.headers.get('Authorization') || '');
  const hash = m ? await sha256Hex(m[1]) : '';
  if (!m || !safeEqual(hash, row.token_hash)) {
    const n = (f && f.until <= now && f.n >= LOCK_AFTER ? 0 : (f ? f.n : 0)) + 1;
    const until = n >= LOCK_AFTER ? now + LOCK_MS : 0;
    await env.DB.prepare('INSERT INTO fails (ip, n, until) VALUES (?, ?, ?) ON CONFLICT(ip) DO UPDATE SET n = excluded.n, until = excluded.until').bind(ip, n, until).run();
    return { err: json({ error: 'unauthorized' }, 401) };
  }
  if (f) await env.DB.prepare('DELETE FROM fails WHERE ip = ?').bind(ip).run();
  return { ok: true };
}

const ID_RE = /^[A-Za-z0-9_.-]{1,120}$/;

async function readBlob(env, id) {
  const meta = await env.DB.prepare('SELECT version, size, chunks FROM blob_meta WHERE id = ?').bind(id).first();
  if (!meta) return null;
  const rows = await env.DB.prepare('SELECT idx, data FROM blob_chunks WHERE id = ? ORDER BY idx').bind(id).all();
  const out = new Uint8Array(meta.size);
  let off = 0;
  for (const r of rows.results) {
    const part = new Uint8Array(r.data);
    out.set(part, off);
    off += part.byteLength;
  }
  if (off !== meta.size) throw new Error('corrupt');
  return { meta, data: out };
}

async function writeBlob(env, id, data, expected) {
  const cur = await env.DB.prepare('SELECT version FROM blob_meta WHERE id = ?').bind(id).first();
  const curV = cur ? cur.version : 0;
  if (expected !== null && expected !== curV) return { conflict: curV };
  const chunks = Math.max(1, Math.ceil(data.byteLength / CHUNK));
  const v = curV + 1;
  const stmts = [env.DB.prepare('DELETE FROM blob_chunks WHERE id = ?').bind(id)];
  for (let i = 0; i < chunks; i++) {
    stmts.push(env.DB.prepare('INSERT INTO blob_chunks (id, idx, data) VALUES (?, ?, ?)').bind(id, i, data.slice(i * CHUNK, (i + 1) * CHUNK)));
  }
  stmts.push(env.DB.prepare('INSERT INTO blob_meta (id, version, size, chunks, updated) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET version = excluded.version, size = excluded.size, chunks = excluded.chunks, updated = excluded.updated')
    .bind(id, v, data.byteLength, chunks, Date.now()));
  await env.DB.batch(stmts);  // معاملة واحدة: يا تنحفظ كلها يا ولا شي
  return { version: v };
}

export default {
  async fetch(req, env) {
    const { h, ok } = cors(env, req);
    if (req.method === 'OPTIONS') return new Response(null, { status: ok ? 204 : 403, headers: h });
    const url = new URL(req.url);
    if (url.pathname === '/' ) return new Response('ok', { headers: { ...SEC, ...h } });
    if (!ok) return json({ error: 'origin' }, 403, h);
    try {
      await ensureSchema(env.DB);
      const p = url.pathname;

      // معلومات التهيئة (الملح فقط — ليس سرًا)
      if (p === '/api/meta' && req.method === 'GET') {
        const row = await env.DB.prepare('SELECT salt, iter FROM auth WHERE id = 1').first();
        return json(row ? { setup: true, salt: row.salt, iter: row.iter } : { setup: false }, 200, h);
      }

      // أول تهيئة: مرة وحدة فقط
      if (p === '/api/setup' && req.method === 'POST') {
        const b = await req.json();
        if (!/^[A-Za-z0-9+/=]{16,64}$/.test(b.salt || '') || !Number.isInteger(b.iter) || b.iter < 100000 || !/^[a-f0-9]{64}$/.test(b.token || '')) return json({ error: 'bad_request' }, 400, h);
        const res = await env.DB.prepare('INSERT OR IGNORE INTO auth (id, token_hash, salt, iter, created) VALUES (1, ?, ?, ?, ?)')
          .bind(await sha256Hex(b.token), b.salt, b.iter, Date.now()).run();
        if (!res.meta.changes) return json({ error: 'already_setup' }, 409, h);
        return json({ ok: true }, 200, h);
      }

      const a = await checkAuth(env, req);
      if (a.err) { for (const [k, v] of Object.entries(h)) a.err.headers.set(k, v); return a.err; }

      if (p === '/api/check' && req.method === 'GET') return json({ ok: true }, 200, h);

      // تغيير الرمز: الجهاز يرفع نسخة معاد تشفيرها من كل عنصر باسم مؤقت (n.)،
      // وهنا تتبدّل كلها مع بصمة الدخول في معاملة وحدة — يا تتم كلها يا ولا شي.
      if (p === '/api/rekey' && req.method === 'POST') {
        const b = await req.json();
        if (!/^[A-Za-z0-9+/=]{16,64}$/.test(b.salt || '') || !Number.isInteger(b.iter) || b.iter < 100000 || !/^[a-f0-9]{64}$/.test(b.token || '')) return json({ error: 'bad_request' }, 400, h);
        const missing = await env.DB.prepare("SELECT COUNT(*) AS n FROM blob_meta o WHERE o.id NOT LIKE 'n.%' AND NOT EXISTS (SELECT 1 FROM blob_meta s WHERE s.id = 'n.' || o.id)").first();
        if (missing.n) return json({ error: 'incomplete', missing: missing.n }, 409, h);
        await env.DB.batch([
          env.DB.prepare("DELETE FROM blob_chunks WHERE id NOT LIKE 'n.%'"),
          env.DB.prepare("DELETE FROM blob_meta WHERE id NOT LIKE 'n.%'"),
          env.DB.prepare("UPDATE blob_chunks SET id = substr(id, 3) WHERE id LIKE 'n.%'"),
          env.DB.prepare("UPDATE blob_meta SET id = substr(id, 3) WHERE id LIKE 'n.%'"),
          env.DB.prepare('UPDATE auth SET token_hash = ?, salt = ?, iter = ? WHERE id = 1').bind(await sha256Hex(b.token), b.salt, b.iter)
        ]);
        return json({ ok: true }, 200, h);
      }

      if (p === '/api/list' && req.method === 'GET') {
        const rows = await env.DB.prepare('SELECT id, version, size, updated FROM blob_meta ORDER BY id').all();
        return json({ items: rows.results }, 200, h);
      }

      const m = /^\/api\/blob\/(.+)$/.exec(p);
      if (m) {
        const id = decodeURIComponent(m[1]);
        if (!ID_RE.test(id)) return json({ error: 'bad_id' }, 400, h);
        if (req.method === 'GET') {
          const r = await readBlob(env, id);
          if (!r) return json({ error: 'not_found' }, 404, h);
          return new Response(r.data, { headers: { 'Content-Type': 'application/octet-stream', 'X-Version': String(r.meta.version), ...SEC, ...h } });
        }
        if (req.method === 'PUT') {
          const len = Number(req.headers.get('Content-Length') || 0);
          if (len > MAX_BLOB) return json({ error: 'too_large' }, 413, h);
          const data = new Uint8Array(await req.arrayBuffer());
          if (data.byteLength > MAX_BLOB) return json({ error: 'too_large' }, 413, h);
          const im = req.headers.get('If-Match');
          const expected = im === null || im === '*' ? null : Number(im);
          const r = await writeBlob(env, id, data, Number.isFinite(expected) ? expected : null);
          if (r.conflict !== undefined) return json({ error: 'conflict', version: r.conflict }, 409, h);
          return json({ version: r.version }, 200, h);
        }
        if (req.method === 'DELETE') {
          await env.DB.batch([
            env.DB.prepare('DELETE FROM blob_chunks WHERE id = ?').bind(id),
            env.DB.prepare('DELETE FROM blob_meta WHERE id = ?').bind(id)
          ]);
          return json({ ok: true }, 200, h);
        }
      }
      return json({ error: 'not_found' }, 404, h);
    } catch (e) {
      return json({ error: 'server', detail: String(e && e.message || e).slice(0, 200) }, 500, h);
    }
  }
};
