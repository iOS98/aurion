// أوريوني — سجل سيارتي (تويوتا أوريون ٢٠١٥)
'use strict';

// ---------- الأيقونات ----------
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  fuel: '<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M3 21h12M4 10h10"/><path d="M14 8h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V9l-3-3"/>',
  oil: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 6.3-6.3"/><path d="M14.7 6.3 13 4.6a4 4 0 0 0-5.4 5.4L3 14.6 6.4 18l4.6-4.6"/>',
  cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  tire: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3v5.5M12 15.5V21M3 12h5.5M15.5 12H21"/>',
  battery: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M7 7V4.5M17 7V4.5M7 13.5h3M14 13.5h3M15.5 12v3"/>',
  doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  check: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
  alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2Z"/>',
  dots: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
  gauge: '<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  car: '<path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5M3 12h18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  back: '<path d="M15 18l-6-6 6-6"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/>',
  clip: '<path d="m21.4 11-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5"/>',
  scale: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3.5 3.5 0 0 0 6 0L5 7ZM19 7l-3 7a3.5 3.5 0 0 0 6 0l-3-7Z"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  archive: '<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>'
};
const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24">${ICONS[n] || ''}</svg>`;

// ---------- الأقسام ----------
const CATS = [
  { k: 'fuel', n: 'وقود', i: 'fuel', c: '#FF8A00' },
  { k: 'oil', n: 'زيت وفلاتر', i: 'oil', c: '#C99A06' },
  { k: 'service', n: 'صيانة وإصلاح', i: 'wrench', c: '#2F5BFF' },
  { k: 'parts', n: 'قطع غيار', i: 'cog', c: '#6E56CF' },
  { k: 'tires', n: 'إطارات', i: 'tire', c: '#64748B' },
  { k: 'battery', n: 'بطارية', i: 'battery', c: '#12A16B' },
  { k: 'insurance', n: 'تأمين', i: 'shield', c: '#0091C2' },
  { k: 'registration', n: 'استمارة ورسوم', i: 'doc', c: '#7A5AF8' },
  { k: 'inspection', n: 'فحص دوري', i: 'check', c: '#00A3A3' },
  { k: 'wash', n: 'غسيل وعناية', i: 'sparkle', c: '#0EA5E9' },
  { k: 'fines', n: 'مخالفات', i: 'alert', c: '#E23D57' },
  { k: 'accessories', n: 'إكسسوارات', i: 'star', c: '#D946EF' },
  { k: 'other', n: 'أخرى', i: 'dots', c: '#7A84A0' }
];
const CAT = Object.fromEntries(CATS.map(c => [c.k, c]));
const catIc = (k, size = '') => { const c = CAT[k] || CAT.other; return `<span class="cat-ic ${size}" style="background:${c.c}1f;color:${c.c}">${ic(c.i)}</span>`; };

const DOC_TYPES = {
  insurance: { n: 'تأمين المركبة', cat: 'insurance', i: 'shield' },
  registration: { n: 'الاستمارة (رخصة السير)', cat: 'registration', i: 'doc' },
  inspection: { n: 'الفحص الفني الدوري', cat: 'inspection', i: 'check' },
  license: { n: 'رخصة القيادة', cat: 'registration', i: 'car' },
  other: { n: 'وثيقة أخرى', cat: 'other', i: 'archive' }
};

const DEFAULT_CAR = {
  make: 'تويوتا', model: 'أوريون', year: 2015, color: 'أبيض',
  vin: '', serial: '', plateAr: '', plateNum: '', plateEn: '',
  engine: 'V6 ‏3.5 لتر (2GR-FE)', fuelGrade: '91', tankL: 70,
  oilSpec: '5W-30 — نحو 6.1 لتر مع الفلتر', tireSize: '', batterySize: '',
  oilInterval: 5000, purchaseOdo: ''
};

// ---------- أدوات عامة ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const NF = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });
const NF0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const num = v => { const n = parseFloat(String(v ?? '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[,،]/g, '')); return isFinite(n) ? n : null; };
const money = (v, dec = true) => `<span style="white-space:nowrap"><span class="num">${(dec ? NF : NF0).format(v || 0)}</span> <span class="cur">ر.س</span></span>`;
const km = v => `<span class="num">${NF0.format(v || 0)}</span> كم`;
const today = () => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
const parseD = s => s ? new Date(s + 'T12:00:00') : null;
const daysTo = s => Math.round((parseD(s) - parseD(today())) / 864e5);
const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const fmtD = s => { const d = parseD(s); return d ? `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` : '—'; };
const addMonths = (s, m) => { const d = parseD(s); d.setMonth(d.getMonth() + Number(m)); return d.toISOString().slice(0, 10); };
function ago(s) {
  const n = -daysTo(s);
  if (n === 0) return 'اليوم';
  if (n === 1) return 'أمس';
  if (n < 0) return `بعد ${rel(-n)}`;
  return `قبل ${rel(n)}`;
}
function rel(n) {
  if (n < 31) return n === 1 ? 'يوم' : n === 2 ? 'يومين' : n <= 10 ? `${n} أيام` : `${n} يومًا`;
  const m = Math.round(n / 30.4);
  if (m < 12) return m === 1 ? 'شهر' : m === 2 ? 'شهرين' : m <= 10 ? `${m} أشهر` : `${m} شهر`;
  const y = Math.floor(m / 12), r = m % 12;
  const ys = y === 1 ? 'سنة' : y === 2 ? 'سنتين' : `${y} سنوات`;
  return r ? `${ys} و${r === 1 ? 'شهر' : r === 2 ? 'شهرين' : r + ' أشهر'}` : ys;
}
// توحيد الكتابة العربية للبحث والمقارنة
const norm = s => String(s || '').toLowerCase()
  .replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
  .split(/\s+/).map(w => w.replace(/^ال(?=..)/, '')).join(' ').trim();

function toast(msg) {
  $('.toast')?.remove();
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
}

// ---------- الاتصال بالخادم ----------
const TK = 'aurion.t', SK = 'aurion.state';
let token = localStorage.getItem(TK) || '';
let S = { records: [], docs: [], odo: [], files: [], car: null };

async function api(method, url, body, isForm) {
  const opt = { method, headers: { Authorization: 'Bearer ' + token } };
  if (body !== undefined) {
    if (isForm) opt.body = body;
    else { opt.headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(body); }
  }
  const r = await fetch(url, opt);
  if (r.status === 401) { logout(); throw new Error('انتهت الجلسة'); }
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'تعذّر الاتصال');
  return r.json();
}
async function load() {
  try {
    S = await api('GET', '/api/state');
    try { localStorage.setItem(SK, JSON.stringify(S)); } catch {}
  } catch (e) {
    const c = localStorage.getItem(SK);
    if (c) { S = JSON.parse(c); toast('أنت بلا اتصال — تُعرض آخر نسخة محفوظة'); }
    else throw e;
  }
}
const car = () => ({ ...DEFAULT_CAR, ...(S.car || {}) });
const fileUrl = id => `/api/files/${id}?t=${encodeURIComponent(token)}`;
const fileMeta = id => S.files.find(f => f.id === id);

async function save(coll, item) {
  const { id, ...data } = item;
  const saved = id ? await api('PUT', `/api/${coll}/${id}`, data) : await api('POST', `/api/${coll}`, data);
  const arr = S[coll]; const i = arr.findIndex(x => x.id === saved.id);
  if (i >= 0) arr[i] = saved; else arr.push(saved);
  try { localStorage.setItem(SK, JSON.stringify(S)); } catch {}
  return saved;
}
async function remove(coll, id) {
  const old = S[coll].find(x => x.id === id);
  await api('DELETE', `/api/${coll}/${id}`);
  S[coll] = S[coll].filter(x => x.id !== id);
  if (old?.fileIds) S.files = S.files.filter(f => !old.fileIds.includes(f.id));
}

// ---------- الحسابات ----------
function currentOdo() {
  let m = num(car().purchaseOdo) || 0;
  for (const r of S.records) m = Math.max(m, num(r.odo) || 0);
  for (const o of S.odo) m = Math.max(m, num(o.odo) || 0);
  return m;
}
// كل المصاريف: السجلات + الوثائق التي لها مبلغ
function expenses() {
  const out = S.records.map(r => ({ ...r, amount: num(r.amount) || 0 }));
  for (const d of S.docs) {
    const a = num(d.amount);
    if (a) out.push({ id: d.id, isDoc: true, cat: DOC_TYPES[d.type]?.cat || 'other', title: d.title || DOC_TYPES[d.type]?.n, date: d.start || d.createdAt?.slice(0, 10), amount: a, vendor: d.company, fileIds: d.fileIds });
  }
  return out.filter(x => x.date).sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || '').localeCompare(a.createdAt || ''));
}
function warrantyInfo(r) {
  if (!r.warrantyUntil && !r.warrantyKm) return null;
  const odo = currentOdo();
  const total = r.warrantyUntil ? Math.max(1, daysTo(r.warrantyUntil) - daysTo(r.date)) : null;
  const left = r.warrantyUntil ? daysTo(r.warrantyUntil) : null;
  const kmEnd = r.warrantyKm && num(r.odo) != null ? num(r.odo) + num(r.warrantyKm) : null;
  const kmLeft = kmEnd != null ? kmEnd - odo : null;
  const expired = (left != null && left < 0) || (kmLeft != null && kmLeft < 0);
  const soon = !expired && ((left != null && left <= 30) || (kmLeft != null && kmLeft <= 1000));
  const pct = left != null ? Math.max(0, Math.min(100, (left / total) * 100)) : (kmLeft != null ? Math.max(0, Math.min(100, kmLeft / num(r.warrantyKm) * 100)) : 0);
  return { left, kmLeft, kmEnd, expired, soon, pct };
}
// استهلاك الوقود بين التعبئات الكاملة
function fuelStats(list = S.records) {
  const f = list.filter(r => r.cat === 'fuel' && num(r.odo)).sort((a, b) => num(a.odo) - num(b.odo));
  const segs = []; let lastFull = null, liters = 0, cost = 0;
  for (const r of f) {
    if (lastFull) { liters += num(r.liters) || 0; cost += num(r.amount) || 0; }
    if (r.full !== false) {
      if (lastFull && liters > 0) {
        const dist = num(r.odo) - num(lastFull.odo);
        if (dist > 0) segs.push({ id: r.id, kmpl: dist / liters, dist, liters, cost, costKm: cost / dist });
      }
      lastFull = r; liters = 0; cost = 0;
    }
  }
  const tot = segs.reduce((a, s) => ({ d: a.d + s.dist, l: a.l + s.liters, c: a.c + s.cost }), { d: 0, l: 0, c: 0 });
  const map = Object.fromEntries(segs.map(s => [s.id, s]));
  return { segs, map, avg: tot.l ? tot.d / tot.l : null, costKm: tot.d ? tot.c / tot.d : null, last: segs[segs.length - 1] };
}
// مواعيد الصيانة القادمة: آخر سجل من كل قسم/اسم يحمل موعدًا قادمًا
function dueItems() {
  const odo = currentOdo(), seen = new Set(), out = [];
  const recs = [...S.records].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  for (const r of recs) {
    const key = r.cat === 'oil' ? 'oil' : r.cat + ':' + norm(r.title);
    if (seen.has(key)) continue; seen.add(key);
    if (!r.nextKm && !r.nextDate) continue;
    const kmLeft = r.nextKm ? num(r.nextKm) - odo : null;
    const dLeft = r.nextDate ? daysTo(r.nextDate) : null;
    const over = (kmLeft != null && kmLeft < 0) || (dLeft != null && dLeft < 0);
    const soon = (kmLeft != null && kmLeft <= 700) || (dLeft != null && dLeft <= 14);
    out.push({ r, kmLeft, dLeft, over, soon });
  }
  return out;
}
function alerts() {
  const out = [];
  for (const d of S.docs) {
    if (!d.end) continue;
    const n = daysTo(d.end), t = DOC_TYPES[d.type] || DOC_TYPES.other;
    // نكتفي بأحدث وثيقة من كل نوع
    const newer = S.docs.some(x => x !== d && x.type === d.type && d.type !== 'other' && (x.end || '') > d.end);
    if (newer) continue;
    if (n < 0) out.push({ tone: 'danger', i: t.i, t: `${d.title || t.n} منتهية`, s: `انتهت ${ago(d.end)} — جدّدها`, href: `#/doc/${d.id}`, w: 0 });
    else if (n <= 30) out.push({ tone: 'warn', i: t.i, t: `${d.title || t.n} تنتهي قريبًا`, s: `${fmtD(d.end)} — بعد ${rel(n)}`, href: `#/doc/${d.id}`, w: 1 });
  }
  for (const x of dueItems()) {
    if (!x.over && !x.soon) continue;
    const parts = [];
    if (x.kmLeft != null) parts.push(x.kmLeft < 0 ? `تجاوزت بـ ${NF0.format(-x.kmLeft)} كم` : `باقي ${NF0.format(x.kmLeft)} كم`);
    if (x.dLeft != null) parts.push(x.dLeft < 0 ? `متأخر ${rel(-x.dLeft)}` : `بعد ${rel(x.dLeft)}`);
    out.push({ tone: x.over ? 'danger' : 'warn', i: CAT[x.r.cat]?.i || 'wrench', t: `موعد ${x.r.cat === 'oil' ? 'تغيير الزيت' : x.r.title || CAT[x.r.cat]?.n}`, s: parts.join(' · '), href: `#/record/${x.r.id}`, w: x.over ? 0 : 2 });
  }
  for (const r of S.records) {
    const w = warrantyInfo(r);
    if (w?.soon) out.push({ tone: 'warn', i: 'shield', t: `ضمان ${r.title || CAT[r.cat]?.n} ينتهي قريبًا`, s: w.left != null ? `بعد ${rel(w.left)}` : `باقي ${NF0.format(w.kmLeft)} كم`, href: `#/record/${r.id}`, w: 3 });
  }
  return out.sort((a, b) => a.w - b.w);
}
// مقارنة سعر صنف بمشترياته السابقة
function priceHistory(title, cat, excludeId) {
  const q = norm(title);
  return S.records.filter(r => r.id !== excludeId && r.cat !== 'fuel' && num(r.amount) && (
    q.length >= 2 ? (norm(r.title).includes(q) || (q.includes(norm(r.title)) && norm(r.title).length >= 3)) : (cat && ['battery', 'tires', 'oil'].includes(cat) && r.cat === cat)
  )).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
const unitPrice = r => (num(r.amount) || 0) / (num(r.qty) || 1);

// ---------- التوجيه ----------
const routes = [];
const route = (re, fn) => routes.push([re, fn]);
function go(h) { location.hash = h; }
async function render() {
  const h = location.hash.slice(1) || '/';
  const [p, qs] = h.split('?');
  const q = Object.fromEntries(new URLSearchParams(qs || ''));
  for (const [re, fn] of routes) {
    const m = p.match(re);
    if (m) {
      const view = $('#view');
      view.innerHTML = await fn(...m.slice(1), q) || '';
      view.style.animation = 'none'; view.offsetHeight; view.style.animation = '';
      fn.after?.(...m.slice(1), q);
      after.forEach(f => f()); after = [];
      $$('.tabbar a').forEach(a => a.classList.toggle('active', a.dataset.tab === tabOf(p)));
      return;
    }
  }
  go('/');
}
const tabOf = p => p === '/' ? 'home' : p.startsWith('/log') || p.startsWith('/record') ? 'log' : p.startsWith('/warranty') ? 'warranty' : p.startsWith('/reports') ? 'reports' : '';
let after = [];
const then = f => after.push(f);
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

const header = (title, sub = '', back = true, extra = '') => `
  <div class="top">
    ${back ? `<button class="icon-btn back" onclick="history.length > 1 ? history.back() : go('/')" aria-label="رجوع">${ic('back')}</button>` : ''}
    <h1>${title}${sub ? `<span class="sub">${sub}</span>` : ''}</h1>${extra}
  </div>`;

function plate(big = false) {
  const c = car();
  if (!c.plateNum) return '';
  const ar = String(c.plateNum).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const arL = c.plateAr.split(/\s+/).reverse().join(' ');
  const enL = c.plateEn.split('').join(' ');
  return `<div class="plate ${big ? 'big' : ''}" aria-label="اللوحة ${esc(c.plateAr)} ${esc(c.plateNum)}">
    <div class="ksa"><i></i>KSA</div>
    <span class="ar d">${esc(ar)}</span><span class="ar">${esc(arL)}</span>
    <span class="en d">${esc(c.plateNum)}</span><span class="en">${esc(enL)}</span></div>`;
}

function recordRow(r, showDate = true) {
  const files = r.fileIds?.length ? ` ${ic('clip', 'clip')}` : '';
  const sub = [showDate ? fmtD(r.date) : '', r.vendor, r.cat === 'fuel' && r.liters ? `${NF.format(r.liters)} لتر` : '', r.odo ? `${NF0.format(r.odo)} كم` : ''].filter(Boolean).join(' · ');
  const href = r.isDoc ? `#/doc/${r.id}` : `#/record/${r.id}`;
  return `<a class="row" href="${href}">${catIc(r.cat)}
    <div class="grow"><div class="t">${esc(r.title || CAT[r.cat]?.n)}${files}</div><div class="s">${esc(sub)}</div></div>
    <div class="amt">${money(r.amount)}</div></a>`;
}

// ---------- الرئيسية ----------
route(/^\/$/, () => {
  const c = car(), ex = expenses(), odo = currentOdo(), fs = fuelStats();
  const ym = today().slice(0, 7), y = today().slice(0, 4);
  const month = ex.filter(x => x.date.startsWith(ym)).reduce((a, x) => a + x.amount, 0);
  const year = ex.filter(x => x.date.startsWith(y)).reduce((a, x) => a + x.amount, 0);
  const all = ex.reduce((a, x) => a + x.amount, 0);
  const al = alerts();
  const activeW = S.records.filter(r => { const w = warrantyInfo(r); return w && !w.expired; }).length;
  const lastFuel = S.records.filter(r => r.cat === 'fuel').sort((a, b) => b.date.localeCompare(a.date))[0];
  const h = new Date().getHours();
  const greet = h < 12 ? 'صباح الخير' : 'مساء الخير';
  return `
  <div class="top"><h1>${greet}<span class="sub">${esc(c.make)} ${esc(c.model)} ${c.year}</span></h1>
    <a class="icon-btn" href="#/car" aria-label="السيارة">${ic('car')}</a></div>
  <section class="hero">
    <div class="hero-head">
      <div><div class="hero-title">سيارتي</div><div class="hero-name">${esc(c.model)} <span class="num">${c.year}</span></div></div>
      ${plate()}
    </div>
    <img class="hero-car" src="/img/car.png" alt="${esc(c.make)} ${esc(c.model)} ${esc(c.color)}">
    <div class="hero-road"></div>
    <div class="hero-stats">
      <div class="hero-stat"><b class="num">${odo ? NF0.format(odo) : '—'}</b><span>كم على العداد</span></div>
      <div class="hero-stat"><b class="num">${fs.avg ? NF.format(fs.avg.toFixed(1)) : '—'}</b><span>كم / لتر</span></div>
      <div class="hero-stat"><b class="num">${NF0.format(month)}</b><span>ر.س الشهر</span></div>
    </div>
  </section>

  <div class="quick">
    <a href="#/add?cat=fuel"><span class="qi" style="color:#FF8A00">${ic('fuel')}</span>تعبئة وقود</a>
    <a href="#/add"><span class="qi" style="color:var(--primary)">${ic('doc')}</span>فاتورة</a>
    <a href="#/compare"><span class="qi" style="color:#12A16B">${ic('scale')}</span>قارن سعر</a>
    <a href="#/docs"><span class="qi" style="color:#0091C2">${ic('shield')}</span>التأمين والوثائق</a>
  </div>

  ${al.length ? `<div class="sec-title">يحتاج انتباهك</div>` + al.slice(0, 5).map(a => `
    <a class="alert tone-${a.tone}" href="${a.href}"><span class="ai">${ic(a.i)}</span><div class="grow"><b>${esc(a.t)}</b><span>${esc(a.s)}</span></div></a>`).join('') : ''}

  <div class="sec-title">نظرة سريعة</div>
  <div class="stats">
    <a class="stat" href="#/reports?p=year"><div class="k">${ic('calendar')} مصاريف ${y}</div><div class="v">${NF0.format(year)}<small>ر.س</small></div></a>
    <a class="stat" href="#/reports?p=all"><div class="k">${ic('chart')} الإجمالي</div><div class="v">${NF0.format(all)}<small>ر.س</small></div></a>
    <a class="stat" href="#/warranty"><div class="k">${ic('shield')} ضمانات سارية</div><div class="v">${activeW}<small>ضمان</small></div></a>
    <a class="stat" href="#/fuel"><div class="k">${ic('fuel')} آخر تعبئة</div><div class="v">${lastFuel ? NF0.format(lastFuel.amount) + '<small>ر.س</small>' : '—'}</div>${lastFuel ? `<div class="d muted">${ago(lastFuel.date)}</div>` : ''}</a>
  </div>

  <div class="sec-title">آخر العمليات <a href="#/log">الكل</a></div>
  ${ex.length ? `<div class="list">${ex.slice(0, 6).map(r => recordRow(r)).join('')}</div>`
    : `<div class="card empty">${ic('car')}<div>ابدأ بإضافة أول فاتورة أو تعبئة وقود من زر <b>+</b></div></div>`}
  `;
});

// ---------- السجل ----------
route(/^\/log$/, (q) => {
  const cat = q.cat || '', s = q.q || '';
  let ex = expenses();
  if (cat) ex = ex.filter(x => x.cat === cat);
  if (s) { const n = norm(s); ex = ex.filter(x => norm([x.title, x.vendor, x.notes, x.brand].join(' ')).includes(n)); }
  const used = new Set(expenses().map(x => x.cat));
  const groups = {};
  for (const x of ex) (groups[x.date.slice(0, 7)] ||= []).push(x);
  then(() => {
    const inp = $('#log-q');
    inp?.addEventListener('change', () => go(`/log?${new URLSearchParams({ ...(cat && { cat }), ...(inp.value && { q: inp.value }) })}`));
  });
  return `${header('السجل', `${ex.length} عملية · ${NF.format(ex.reduce((a, x) => a + x.amount, 0))} ر.س`, false)}
  <label class="search">${ic('search')}<input id="log-q" type="search" placeholder="ابحث باسم الصنف أو المحل…" value="${esc(s)}" enterkeyhint="search"></label>
  <div class="chips">
    <a class="chip ${!cat ? 'on' : ''}" href="#/log${s ? '?q=' + encodeURIComponent(s) : ''}">الكل</a>
    ${CATS.filter(c => used.has(c.k)).map(c => `<a class="chip ${cat === c.k ? 'on' : ''}" href="#/log?cat=${c.k}${s ? '&q=' + encodeURIComponent(s) : ''}">${esc(c.n)}</a>`).join('')}
  </div>
  ${Object.keys(groups).length ? Object.entries(groups).map(([m, items]) => {
    const [yy, mm] = m.split('-');
    return `<div class="month-h"><span>${MONTHS[+mm - 1]} ${yy}</span><span class="num">${NF.format(items.reduce((a, x) => a + x.amount, 0))} ر.س</span></div>
      <div class="list">${items.map(r => recordRow(r)).join('')}</div>`;
  }).join('') : `<div class="card empty">${ic('list')}<div>لا توجد عمليات${cat || s ? ' مطابقة' : ' بعد'}</div></div>`}`;
});

// ---------- تفاصيل عملية ----------
route(/^\/record\/(\w+)$/, (id) => {
  const r = S.records.find(x => x.id === id);
  if (!r) return `${header('غير موجود')}`;
  const c = CAT[r.cat] || CAT.other, w = warrantyInfo(r);
  const fs = r.cat === 'fuel' ? fuelStats().map[r.id] : null;
  const hist = r.cat !== 'fuel' ? priceHistory(r.title, r.cat, r.id).filter(x => x.date <= r.date).slice(0, 4) : [];
  const kv = (k, v) => v || v === 0 ? `<div class="kv"><span>${k}</span><span>${v}</span></div>` : '';
  return `${header('', '', true, `<a class="icon-btn" href="#/edit/${r.id}" aria-label="تعديل">${ic('edit')}</a>`)}
  <div class="detail-head">${catIc(r.cat)}
    <div class="muted small">${esc(c.n)}</div>
    <h2 style="margin:2px 0 4px;font-size:21px">${esc(r.title || c.n)}</h2>
    <div class="big">${money(r.amount)}</div>
    <div class="muted small">${fmtD(r.date)} · ${ago(r.date)}</div>
  </div>
  ${w ? `<div class="card w-card">
    <div class="top-r"><span class="cat-ic" style="background:var(--ok-soft);color:var(--ok)">${ic('shield')}</span>
      <div class="grow"><b>الضمان</b><div class="small muted">${r.warrantyUntil ? 'حتى ' + fmtD(r.warrantyUntil) : ''}${w.kmEnd ? ` · حتى ${NF0.format(w.kmEnd)} كم` : ''}</div></div>
      ${wBadge(w)}</div>
    <div class="prog ${w.expired ? 'danger' : w.soon ? 'warn' : ''}"><i style="width:${w.pct}%"></i></div></div>` : ''}
  <div class="card">
    ${kv('المحل / الورشة', esc(r.vendor))}
    ${kv('الماركة', esc(r.brand))}
    ${kv('الكمية', r.qty && r.qty != 1 ? `<span class="num">${NF.format(r.qty)}</span> · سعر الحبة ${money(unitPrice(r))}` : '')}
    ${r.cat === 'fuel' ? kv('الكمية', r.liters ? `<span class="num">${NF.format(r.liters)}</span> لتر` : '') + kv('سعر اللتر', r.liters ? money(num(r.amount) / num(r.liters)) : '') + kv('نوع البنزين', esc(r.grade)) + kv('تعبئة كاملة', r.full === false ? 'لا' : 'نعم') : ''}
    ${fs ? kv('الاستهلاك', `<span class="num">${NF.format(fs.kmpl.toFixed(1))}</span> كم/لتر · ${NF0.format(fs.dist)} كم`) + kv('تكلفة الكيلو', money(fs.costKm)) : ''}
    ${kv('قراءة العداد', r.odo ? km(r.odo) : '')}
    ${kv('الموعد القادم', [r.nextKm ? km(r.nextKm) : '', r.nextDate ? fmtD(r.nextDate) : ''].filter(Boolean).join(' أو '))}
    ${kv('ملاحظات', esc(r.notes))}
  </div>
  ${hist.length ? `<div class="sec-title">مقارنة بالمشتريات السابقة</div><div class="list">${hist.map(h => {
    const diff = unitPrice(r) - unitPrice(h);
    return `<a class="row" href="#/record/${h.id}">${catIc(h.cat)}<div class="grow"><div class="t">${esc(h.title)}</div><div class="s">${fmtD(h.date)} · ${esc(h.vendor || '')}</div></div>
      <div class="amt">${money(unitPrice(h))}<small>${diff === 0 ? 'نفس السعر' : (diff > 0 ? 'الآن أغلى بـ ' : 'الآن أرخص بـ ') + NF.format(Math.abs(diff))}</small></div></a>`;
  }).join('')}</div>` : ''}
  ${filesView(r.fileIds)}
  <div class="btns"><a class="btn ghost" href="#/add?dup=${r.id}">${ic('plus')} سجّل عملية مشابهة</a></div>`;
});
function wBadge(w) {
  if (w.expired) return `<span class="badge mute">منتهي</span>`;
  const t = w.left != null ? `باقي ${rel(w.left)}` : `باقي ${NF0.format(w.kmLeft)} كم`;
  return `<span class="badge ${w.soon ? 'warn' : 'ok'}">${t}</span>`;
}
function filesView(ids) {
  if (!ids?.length) return '';
  return `<div class="sec-title">الفواتير والمرفقات</div><div class="card"><div class="files" style="padding:0">${ids.map(id => thumb(id)).join('')}</div></div>`;
}
function thumb(id, removable = false) {
  const m = fileMeta(id); if (!m) return '';
  const inner = m.mime.startsWith('image/') ? `<img src="${fileUrl(id)}" alt="" loading="lazy">` : `${ic('doc')}<br>PDF`;
  return `<button type="button" class="thumb" data-file="${id}" onclick="openFile('${id}')">${inner}${removable ? `<span class="x" onclick="event.stopPropagation();dropFile('${id}')">✕</span>` : ''}</button>`;
}
window.openFile = id => {
  const m = fileMeta(id); if (!m) return;
  if (!m.mime.startsWith('image/')) { window.open(fileUrl(id), '_blank'); return; }
  const v = document.createElement('div'); v.className = 'viewer';
  v.innerHTML = `<div class="vbar"><button>إغلاق</button><a href="${fileUrl(id)}" target="_blank">فتح الأصل</a></div><div class="vimg"><img src="${fileUrl(id)}" alt=""></div>`;
  v.querySelector('button').onclick = () => v.remove();
  document.body.appendChild(v);
};

// ---------- إضافة / تعديل عملية ----------
let draftFiles = [];
const recordForm = (id, q) => {
  const ed = id ? S.records.find(x => x.id === id) : null;
  const dup = q.dup ? S.records.find(x => x.id === q.dup) : null;
  const c = car();
  const r = ed || (dup ? { ...dup, id: undefined, date: today(), odo: '', fileIds: [], notes: '', nextKm: '', nextDate: '', warrantyUntil: '' } : { cat: q.cat || '', date: today(), full: true, grade: c.fuelGrade });
  draftFiles = [...(r.fileIds || [])];
  const cat = r.cat || 'service';
  const isFuel = cat === 'fuel';
  then(() => bindRecordForm(r, ed));
  return `${header(ed ? 'تعديل العملية' : isFuel ? 'تعبئة وقود' : 'عملية جديدة', '', true)}
  <form class="form" id="rf" autocomplete="off">
    <div class="form-label">القسم</div>
    <div class="cat-grid">${CATS.map(k => `<button type="button" data-cat="${k.k}" class="${k.k === cat ? 'on' : ''}">${catIc(k.k)}${esc(k.n)}</button>`).join('')}</div>
    <input type="hidden" name="cat" value="${cat}">
    <div id="hint"></div>
    <div class="card">
      <label class="field" data-show="notfuel"><span>اسم الصنف أو الخدمة</span><input name="title" list="titles" value="${esc(r.title)}" placeholder="مثال: بطارية، فحمات أمامية، تغيير زيت"></label>
      <div class="two">
        <label class="field"><span>المبلغ الإجمالي</span><div class="unit"><input name="amount" inputmode="decimal" value="${esc(r.amount)}" placeholder="0" required><em>ر.س</em></div></label>
        <label class="field"><span>التاريخ</span><input type="date" name="date" value="${esc(r.date)}" required></label>
      </div>
      <div class="two" data-show="fuel">
        <label class="field"><span>اللترات</span><div class="unit"><input name="liters" inputmode="decimal" value="${esc(r.liters)}" placeholder="0"><em>لتر</em></div></label>
        <label class="field"><span>سعر اللتر</span><div class="unit"><input name="ppl" inputmode="decimal" value="${r.liters && r.amount ? (num(r.amount) / num(r.liters)).toFixed(2) : ''}" placeholder="2.18"><em>ر.س</em></div></label>
      </div>
      <div class="two">
        <label class="field"><span>عداد الكيلومترات</span><div class="unit"><input name="odo" inputmode="numeric" value="${esc(r.odo)}" placeholder="${currentOdo() ? NF0.format(currentOdo()) : '0'}"><em>كم</em></div></label>
        <label class="field" data-show="fuel"><span>نوع البنزين</span><select name="grade">${['91', '95', 'ديزل'].map(g => `<option ${r.grade === g ? 'selected' : ''}>${g}</option>`).join('')}</select></label>
        <label class="field" data-show="notfuel"><span>الكمية</span><input name="qty" inputmode="decimal" value="${esc(r.qty || '')}" placeholder="1"></label>
      </div>
      <div class="toggle" data-show="fuel"><span>عبّيت الخزان للآخر (فُل)</span><input type="checkbox" name="full" ${r.full !== false ? 'checked' : ''}></div>
      <label class="field"><span>${isFuel ? 'المحطة' : 'المحل / الورشة'}</span><input name="vendor" list="vendors" value="${esc(r.vendor)}" placeholder="${isFuel ? 'مثال: ساسكو' : 'اسم المحل'}"></label>
      <label class="field" data-show="notfuel"><span>الماركة / رقم القطعة</span><input name="brand" value="${esc(r.brand)}" placeholder="اختياري"></label>
    </div>

    <div data-show="notfuel">
      <div class="form-label">الضمان</div>
      <div class="card">
        <div class="two">
          <label class="field"><span>مدة الضمان</span><select name="wMonths"><option value="">بدون ضمان</option>${[1, 3, 6, 12, 18, 24, 36, 48, 60].map(m => `<option value="${m}">${m < 12 ? m + ' أشهر' : m === 12 ? 'سنة' : m === 24 ? 'سنتان' : m / 12 + ' سنوات'}</option>`).join('')}<option value="custom">تاريخ محدد…</option></select></label>
          <label class="field"><span>ينتهي في</span><input type="date" name="warrantyUntil" value="${esc(r.warrantyUntil)}"></label>
        </div>
        <label class="field"><span>أو حد كيلومترات للضمان (اختياري)</span><div class="unit"><input name="warrantyKm" inputmode="numeric" value="${esc(r.warrantyKm)}" placeholder="مثال: 40000"><em>كم</em></div></label>
      </div>

      <div class="form-label">الموعد القادم (تذكير)</div>
      <div class="card"><div class="two">
        <label class="field"><span>عند العداد</span><div class="unit"><input name="nextKm" inputmode="numeric" value="${esc(r.nextKm)}" placeholder="—"><em>كم</em></div></label>
        <label class="field"><span>أو بتاريخ</span><input type="date" name="nextDate" value="${esc(r.nextDate)}"></label>
      </div></div>
    </div>

    <div class="form-label">الفاتورة والمرفقات</div>
    <div class="card"><div class="files" id="files"></div>
      <input type="file" id="file-in" accept="image/*,application/pdf" multiple hidden></div>

    <div class="card"><label class="field"><span>ملاحظات</span><textarea name="notes" placeholder="أي تفاصيل تفيدك لاحقًا">${esc(r.notes)}</textarea></label></div>

    <div class="btns">
      <button class="btn" type="submit">${ic('check')} حفظ</button>
      ${ed ? `<button class="btn danger" type="button" id="del">${ic('trash')} حذف العملية</button>` : ''}
    </div>
    <datalist id="titles">${[...new Set(S.records.map(x => x.title).filter(Boolean))].map(t => `<option value="${esc(t)}">`).join('')}</datalist>
    <datalist id="vendors">${[...new Set(S.records.map(x => x.vendor).filter(Boolean))].map(t => `<option value="${esc(t)}">`).join('')}</datalist>
  </form>`;
};
route(/^\/add$/, q => recordForm(null, q));
route(/^\/edit\/(\w+)$/, (id, q) => recordForm(id, q));

function renderDraftFiles() {
  const box = $('#files'); if (!box) return;
  box.innerHTML = draftFiles.map(id => thumb(id, true)).join('') +
    `<button type="button" class="thumb add" onclick="$('#file-in').click()">${ic('camera')}<span>إضافة</span></button>`;
}
window.dropFile = id => { draftFiles = draftFiles.filter(x => x !== id); renderDraftFiles(); };

// تصغير الصور قبل الرفع حتى تبقى خفيفة وواضحة
async function shrink(file) {
  if (!file.type.startsWith('image/') || file.size < 400e3) return file;
  try {
    const img = await createImageBitmap(file);
    const k = Math.min(1, 2000 / Math.max(img.width, img.height));
    const cv = document.createElement('canvas'); cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
    const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', .85));
    return blob ? new File([blob], (file.name || 'photo').replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
  } catch { return file; }
}
async function uploadFiles(fileList) {
  const fd = new FormData();
  for (const f of fileList) fd.append('files', await shrink(f));
  toast('جارٍ رفع المرفقات…');
  const metas = await api('POST', '/api/files', fd, true);
  S.files.push(...metas);
  return metas.map(m => m.id);
}
function bindFileInput() {
  renderDraftFiles();
  $('#file-in').addEventListener('change', async e => {
    try { draftFiles.push(...await uploadFiles(e.target.files)); renderDraftFiles(); toast('تم إرفاق الملف'); }
    catch (err) { toast(err.message); }
    e.target.value = '';
  });
}

function bindRecordForm(r, ed) {
  const f = $('#rf');
  const setCat = k => {
    f.cat.value = k;
    $$('.cat-grid button', f).forEach(b => b.classList.toggle('on', b.dataset.cat === k));
    $$('[data-show="fuel"]', f).forEach(el => el.hidden = k !== 'fuel');
    $$('[data-show="notfuel"]', f).forEach(el => el.hidden = k === 'fuel');
    // تذكير تلقائي لتغيير الزيت
    if (k === 'oil' && !f.nextKm.value && num(f.odo.value)) f.nextKm.value = num(f.odo.value) + Number(car().oilInterval || 5000);
    if (k === 'fuel' && !f.vendor.value) f.vendor.placeholder = 'مثال: ساسكو';
    updateHint();
  };
  $$('.cat-grid button', f).forEach(b => b.onclick = () => setCat(b.dataset.cat));

  // حساب اللترات ↔ السعر ↔ المبلغ
  const calc = src => {
    const a = num(f.amount.value), l = num(f.liters.value), p = num(f.ppl.value);
    if (src !== 'ppl' && a && l) f.ppl.value = (a / l).toFixed(2);
    else if (src === 'ppl' && p && l) f.amount.value = (p * l).toFixed(2);
    else if (src === 'ppl' && p && a) f.liters.value = (a / p).toFixed(2);
  };
  f.amount.addEventListener('input', () => { if (f.cat.value === 'fuel') calc('amount'); updateHint(); });
  f.liters.addEventListener('input', () => calc('liters'));
  f.ppl.addEventListener('input', () => calc('ppl'));
  f.title.addEventListener('input', updateHint);
  f.qty.addEventListener('input', updateHint);
  f.odo.addEventListener('change', () => { if (f.cat.value === 'oil' && !f.nextKm.value && num(f.odo.value)) f.nextKm.value = num(f.odo.value) + Number(car().oilInterval || 5000); });
  f.wMonths.addEventListener('change', () => {
    const m = f.wMonths.value;
    if (m === 'custom') f.warrantyUntil.focus();
    else if (m) f.warrantyUntil.value = addMonths(f.date.value || today(), m);
    else f.warrantyUntil.value = '';
  });

  function updateHint() {
    const k = f.cat.value, box = $('#hint');
    if (k === 'fuel') {
      const last = S.records.filter(x => x.cat === 'fuel' && x.id !== r.id && x.liters).sort((a, b) => b.date.localeCompare(a.date))[0];
      box.innerHTML = last ? `<div class="hint">آخر تعبئة ${ago(last.date)}: <b class="num">${NF.format(last.amount)}</b> ر.س · سعر اللتر <b class="num">${(num(last.amount) / num(last.liters)).toFixed(2)}</b>${last.odo ? ` · العداد ${NF0.format(last.odo)}` : ''}</div>` : '';
      return;
    }
    const hist = priceHistory(f.title.value, k, r.id).slice(0, 3);
    if (!hist.length) { box.innerHTML = ''; return; }
    const cur = (num(f.amount.value) || 0) / (num(f.qty.value) || 1);
    box.innerHTML = `<div class="hint"><div style="margin-bottom:4px">${ic('scale')} اشتريته قبل كذا:</div>${hist.map(h => {
      const d = cur ? cur - unitPrice(h) : 0;
      return `<div class="hr"><span>${esc(h.title)} · ${ago(h.date)}${h.vendor ? ' · ' + esc(h.vendor) : ''}</span><span><b class="num">${NF.format(unitPrice(h))}</b>${cur && d ? ` <span class="badge ${d > 0 ? 'danger' : 'ok'}">${d > 0 ? '▲' : '▼'} ${NF.format(Math.abs(d))}</span>` : ''}</span></div>`;
    }).join('')}</div>`;
  }

  setCat(f.cat.value);
  $('.cat-grid .on', f)?.scrollIntoView({ inline: 'center', block: 'nearest' });
  if (r.warrantyUntil) f.wMonths.value = 'custom';
  bindFileInput();

  f.onsubmit = async e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(f));
    const k = fd.cat;
    const amount = num(fd.amount);
    if (!amount && amount !== 0) return toast('اكتب المبلغ');
    const item = {
      id: ed?.id, cat: k, date: fd.date || today(), amount,
      title: k === 'fuel' ? `بنزين ${fd.grade || ''}`.trim() : (fd.title || '').trim() || CAT[k].n,
      odo: num(fd.odo), vendor: (fd.vendor || '').trim(), notes: (fd.notes || '').trim(), fileIds: draftFiles
    };
    if (k === 'fuel') Object.assign(item, { liters: num(fd.liters), grade: fd.grade, full: !!f.full.checked });
    else Object.assign(item, {
      qty: num(fd.qty), brand: (fd.brand || '').trim(),
      warrantyUntil: fd.warrantyUntil || '', warrantyKm: num(fd.warrantyKm),
      nextKm: num(fd.nextKm), nextDate: fd.nextDate || ''
    });
    for (const key of Object.keys(item)) if (item[key] === null || item[key] === '') delete item[key];
    const btn = f.querySelector('[type=submit]'); btn.disabled = true;
    try {
      const saved = await save('records', item);
      toast('تم الحفظ ✓');
      history.replaceState(null, '', '#/record/' + saved.id); render();
    } catch (err) { toast(err.message); btn.disabled = false; }
  };
  $('#del')?.addEventListener('click', async () => {
    if (!confirm('حذف هذه العملية ومرفقاتها نهائيًا؟')) return;
    try { await remove('records', ed.id); toast('تم الحذف'); go('/log'); } catch (err) { toast(err.message); }
  });
}

// ---------- الضمانات ----------
route(/^\/warranty$/, (q) => {
  const all = S.records.map(r => ({ r, w: warrantyInfo(r) })).filter(x => x.w);
  const active = all.filter(x => !x.w.expired).sort((a, b) => (a.w.left ?? 1e9) - (b.w.left ?? 1e9));
  const expired = all.filter(x => x.w.expired).sort((a, b) => (b.r.warrantyUntil || '').localeCompare(a.r.warrantyUntil || ''));
  const tab = q.t === 'archive' ? 'archive' : 'active';
  const card = ({ r, w }) => `<a class="card w-card" href="#/record/${r.id}" style="display:block">
    <div class="top-r">${catIc(r.cat)}<div class="grow" style="min-width:0"><div class="t" style="font-weight:600">${esc(r.title)}</div>
      <div class="small muted">${fmtD(r.date)}${r.vendor ? ' · ' + esc(r.vendor) : ''} · ${money(r.amount)}</div></div>${wBadge(w)}</div>
    ${!w.expired ? `<div class="prog ${w.soon ? 'warn' : ''}"><i style="width:${w.pct}%"></i></div>
      <div class="small muted" style="margin-top:6px;display:flex;justify-content:space-between"><span>${r.warrantyUntil ? 'ينتهي ' + fmtD(r.warrantyUntil) : ''}</span><span>${w.kmEnd ? 'حتى ' + NF0.format(w.kmEnd) + ' كم' : ''}</span></div>`
      : `<div class="small muted" style="margin-top:8px">${ic('archive')} انتهى ${r.warrantyUntil ? ago(r.warrantyUntil) : ''} — الفاتورة مؤرشفة ${r.fileIds?.length ? `(${r.fileIds.length} مرفق)` : 'بدون مرفق'}</div>`}
  </a>`;
  return `${header('الضمانات', `${active.length} ساري · ${expired.length} في الأرشيف`, false)}
  <div class="seg"><button class="${tab === 'active' ? 'on' : ''}" onclick="go('/warranty')">السارية</button><button class="${tab === 'archive' ? 'on' : ''}" onclick="go('/warranty?t=archive')">الأرشيف</button></div>
  ${tab === 'active'
    ? (active.length ? active.map(card).join('') : `<div class="card empty">${ic('shield')}<div>لا توجد ضمانات سارية.<br><span class="small">عند إضافة قطعة حدّد مدة ضمانها وسنتابعها لك ونؤرشف فاتورتها بعد انتهائه.</span></div></div>`)
    : (expired.length ? expired.map(card).join('') : `<div class="card empty">${ic('archive')}<div>الأرشيف فارغ</div></div>`)}`;
});

// ---------- الوقود ----------
route(/^\/fuel$/, () => {
  const fs = fuelStats();
  const fills = S.records.filter(r => r.cat === 'fuel').sort((a, b) => b.date.localeCompare(a.date) || (num(b.odo) || 0) - (num(a.odo) || 0));
  const y = today().slice(0, 4);
  const yearCost = fills.filter(r => r.date.startsWith(y)).reduce((a, r) => a + num(r.amount), 0);
  const liters = fills.reduce((a, r) => a + (num(r.liters) || 0), 0);
  const lastP = fills.find(r => r.liters);
  return `${header('الوقود', `${fills.length} تعبئة`)}
  <div class="stats">
    <div class="stat"><div class="k">${ic('gauge')} متوسط الاستهلاك</div><div class="v">${fs.avg ? fs.avg.toFixed(1) : '—'}<small>كم/لتر</small></div><div class="d muted">${fs.avg ? (100 / fs.avg).toFixed(1) + ' لتر لكل ١٠٠ كم' : 'يحتاج تعبئتين كاملتين'}</div></div>
    <div class="stat"><div class="k">${ic('trend')} تكلفة الكيلو</div><div class="v">${fs.costKm ? fs.costKm.toFixed(2) : '—'}<small>ر.س</small></div><div class="d muted">${fs.costKm ? 'كل ١٠٠ كم ≈ ' + NF0.format(fs.costKm * 100) + ' ر.س' : '&nbsp;'}</div></div>
    <div class="stat"><div class="k">${ic('calendar')} وقود ${y}</div><div class="v">${NF0.format(yearCost)}<small>ر.س</small></div></div>
    <div class="stat"><div class="k">${ic('fuel')} آخر سعر لتر</div><div class="v">${lastP ? (num(lastP.amount) / num(lastP.liters)).toFixed(2) : '—'}<small>ر.س</small></div><div class="d muted">إجمالي ${NF0.format(liters)} لتر</div></div>
  </div>
  <div class="btns"><a class="btn" href="#/add?cat=fuel">${ic('plus')} تعبئة جديدة</a></div>
  <div class="sec-title">التعبئات</div>
  ${fills.length ? `<div class="list">${fills.map(r => {
    const s = fs.map[r.id];
    return `<a class="row" href="#/record/${r.id}">${catIc('fuel')}<div class="grow"><div class="t">${fmtD(r.date)}${r.full === false ? ' <span class="badge mute">جزئية</span>' : ''}</div>
      <div class="s">${[r.liters ? NF.format(r.liters) + ' لتر' : '', r.odo ? NF0.format(r.odo) + ' كم' : '', r.vendor].filter(Boolean).join(' · ')}</div></div>
      <div class="amt">${money(r.amount)}${s ? `<small>${s.kmpl.toFixed(1)} كم/لتر</small>` : ''}</div></a>`;
  }).join('')}</div>` : `<div class="card empty">${ic('fuel')}<div>سجّل تعبئاتك مع قراءة العداد ونحسب لك استهلاك السيارة الحقيقي</div></div>`}`;
});

// ---------- مقارنة الأسعار ----------
route(/^\/compare$/, (q) => {
  const s = q.q || '';
  const names = {};
  for (const r of S.records) if (r.cat !== 'fuel' && r.title && num(r.amount)) {
    const k = norm(r.title); (names[k] ||= { title: r.title, cat: r.cat, n: 0, last: r.date }).n++;
    if (r.date > names[k].last) names[k].last = r.date;
  }
  const hist = s ? priceHistory(s) : [];
  const ups = hist.map(unitPrice);
  then(() => $('#cq')?.addEventListener('change', e => go('/compare?q=' + encodeURIComponent(e.target.value))));
  return `${header('قارن الأسعار', 'كم دفعت على نفس الشيء قبل؟')}
  <label class="search">${ic('search')}<input id="cq" type="search" placeholder="مثال: بطارية، فحمات، زيت…" value="${esc(s)}" enterkeyhint="search"></label>
  ${s ? (hist.length ? `
    <div class="stats">
      <div class="stat"><div class="k">آخر سعر</div><div class="v">${NF.format(ups[0])}<small>ر.س</small></div><div class="d muted">${ago(hist[0].date)}</div></div>
      <div class="stat"><div class="k">المتوسط</div><div class="v">${NF.format(ups.reduce((a, b) => a + b, 0) / ups.length)}<small>ر.س</small></div><div class="d muted">${hist.length} مرة</div></div>
      <div class="stat"><div class="k">${ic('trend')} الأرخص</div><div class="v" style="color:var(--ok)">${NF.format(Math.min(...ups))}<small>ر.س</small></div></div>
      <div class="stat"><div class="k">الأغلى</div><div class="v" style="color:var(--danger)">${NF.format(Math.max(...ups))}<small>ر.س</small></div></div>
    </div>
    <div class="sec-title">كل المرات</div>
    <div class="list">${hist.map((r, i) => {
      const prev = hist[i + 1]; const d = prev ? unitPrice(r) - unitPrice(prev) : 0;
      return `<a class="row" href="#/record/${r.id}">${catIc(r.cat)}<div class="grow"><div class="t">${esc(r.title)}${r.brand ? ' · ' + esc(r.brand) : ''}</div><div class="s">${fmtD(r.date)}${r.vendor ? ' · ' + esc(r.vendor) : ''}${r.qty > 1 ? ' · ×' + r.qty : ''}</div></div>
        <div class="amt">${money(unitPrice(r))}${prev && d ? `<small style="color:var(--${d > 0 ? 'danger' : 'ok'})">${d > 0 ? '▲' : '▼'} ${NF.format(Math.abs(d))}</small>` : ''}</div></a>`;
    }).join('')}</div>` : `<div class="card empty">${ic('search')}<div>ما لقيت مشتريات باسم «${esc(s)}»</div></div>`)
  : `<div class="sec-title">أصناف اشتريتها</div>
    ${Object.values(names).length ? `<div class="list">${Object.values(names).sort((a, b) => b.last.localeCompare(a.last)).map(n => `
      <a class="row" href="#/compare?q=${encodeURIComponent(n.title)}">${catIc(n.cat)}<div class="grow"><div class="t">${esc(n.title)}</div><div class="s">${n.n} ${n.n === 1 ? 'مرة' : 'مرات'} · آخرها ${ago(n.last)}</div></div>${ic('back')}</a>`).join('')}</div>`
      : `<div class="card empty">${ic('scale')}<div>كل ما تسجّل مشترياتك يصير عندك مرجع أسعار تقارن فيه</div></div>`}`}`;
});

// ---------- التقارير ----------
route(/^\/reports$/, (q) => {
  const p = q.p || 'year';
  const t = today(), all = expenses();
  const from = { month: t.slice(0, 7) + '-01', '3m': addMonths(t, -3), year: t.slice(0, 4) + '-01-01', '12m': addMonths(t, -12), all: '0000' }[p] || '0000';
  const ex = all.filter(x => x.date >= from);
  const total = ex.reduce((a, x) => a + x.amount, 0);
  const byCat = {};
  for (const x of ex) byCat[x.cat] = (byCat[x.cat] || 0) + x.amount;
  const cats = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const max = cats[0]?.[1] || 1;
  // تكلفة الكيلو خلال الفترة
  const odos = [...S.records, ...S.odo].filter(r => r.date >= from && num(r.odo)).map(r => num(r.odo));
  const dist = odos.length > 1 ? Math.max(...odos) - Math.min(...odos) : 0;
  const days = Math.max(1, -daysTo(ex.length ? ex[ex.length - 1].date : t) + 1);
  // آخر ١٢ شهرًا
  const months = [];
  for (let i = 11; i >= 0; i--) { const d = parseD(t.slice(0, 7) + '-15'); d.setMonth(d.getMonth() - i); months.push(d.toISOString().slice(0, 7)); }
  const mv = months.map(m => all.filter(x => x.date.startsWith(m)).reduce((a, x) => a + x.amount, 0));
  const years = {};
  for (const x of all) years[x.date.slice(0, 4)] = (years[x.date.slice(0, 4)] || 0) + x.amount;
  then(() => bindCols(months, mv));
  const P = [['month', 'الشهر'], ['3m', '٣ أشهر'], ['year', 'السنة'], ['12m', '١٢ شهر'], ['all', 'الكل']];
  return `${header('التقارير', '', false)}
  <div class="seg">${P.map(([k, n]) => `<button class="${p === k ? 'on' : ''}" onclick="go('/reports?p=${k}')">${n}</button>`).join('')}</div>
  <div class="total-hero">
    <div class="k">إجمالي المصاريف</div>
    <div class="v"><span class="num">${NF.format(total)}</span> <small style="font-size:16px">ر.س</small></div>
    <div class="row2"><span>${ex.length} عملية</span>${p !== 'month' ? `<span>متوسط شهري ≈ <b class="num">${NF0.format(total / Math.max(1, days / 30.4))}</b></span>` : ''}${dist ? `<span>${NF0.format(dist)} كم · <b class="num">${(total / dist).toFixed(2)}</b> ر.س/كم</span>` : ''}</div>
  </div>
  <div class="sec-title">حسب القسم</div>
  <div class="card">${cats.length ? cats.map(([k, v]) => `
    <div class="hbar" onclick="go('/log?cat=${k}')"><div class="l">${catIc(k)}<span class="grow">${esc(CAT[k]?.n || k)}</span><b class="num">${NF.format(v)}</b><small class="num">${Math.round(v / total * 100)}%</small></div>
    <div class="track"><i style="width:${v / max * 100}%"></i></div></div>`).join('') : `<div class="empty">لا توجد مصاريف في هذه الفترة</div>`}</div>
  <div class="sec-title">آخر ١٢ شهرًا</div>
  <div class="card cols" id="cols"></div>
  ${Object.keys(years).length > 1 ? `<div class="sec-title">حسب السنة</div><div class="list">${Object.entries(years).sort((a, b) => b[0].localeCompare(a[0])).map(([yy, v]) => `
    <div class="row" style="cursor:default"><div class="grow"><div class="t num" style="text-align:start">${yy}</div></div><div class="amt">${money(v)}</div></div>`).join('')}</div>` : ''}`;
});
function bindCols(months, vals) {
  const box = $('#cols'); if (!box) return;
  const W = 340, H = 170, pad = 22, bw = (W - 8) / 12, max = Math.max(...vals, 1);
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  let g = '';
  for (let v = 0; v <= top; v += step) {
    const y = H - pad - (v / top) * (H - pad - 10);
    g += `<line class="grid" x1="0" x2="${W}" y1="${y}" y2="${y}"/><text x="${W}" y="${y - 3}" text-anchor="end">${NF0.format(v)}</text>`;
  }
  const bars = vals.map((v, i) => {
    const h = Math.max(v ? 3 : 0, (v / top) * (H - pad - 10));
    const x = 4 + i * bw + bw * .2, w = bw * .6, y = H - pad - h;
    const r = Math.min(4, w / 2, h);
    const path = h ? `M${x},${H - pad} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${H - pad} Z` : '';
    const m = +months[i].slice(5) - 1;
    return `<g data-i="${i}"><rect x="${4 + i * bw}" y="0" width="${bw}" height="${H}" fill="transparent"/>${path ? `<path class="col ${i < 11 ? '' : ''}" d="${path}"/>` : ''}
      <text x="${x + w / 2}" y="${H - 6}" text-anchor="middle">${MONTHS[m].slice(0, 3)}</text></g>`;
  }).join('');
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="المصاريف الشهرية لآخر ١٢ شهرًا">${g}${bars}</svg><div class="tip"></div>`;
  const tip = $('.tip', box), svg = $('svg', box);
  const show = e => {
    const gEl = e.target.closest('g[data-i]'); if (!gEl) return;
    const i = +gEl.dataset.i, [yy, mm] = months[i].split('-');
    $$('.col', svg).forEach(c => c.classList.toggle('dim', c.parentNode !== gEl));
    tip.innerHTML = `${MONTHS[+mm - 1]} ${yy}: <b class="num">${NF.format(vals[i])}</b> ر.س`;
    const br = box.getBoundingClientRect(), r = gEl.getBoundingClientRect();
    tip.style.left = Math.min(br.width - 70, Math.max(70, r.left - br.left + r.width / 2)) + 'px';
    tip.style.top = '40px'; tip.classList.add('on');
  };
  svg.addEventListener('pointermove', show); svg.addEventListener('pointerdown', show);
  svg.addEventListener('pointerleave', () => { tip.classList.remove('on'); $$('.col', svg).forEach(c => c.classList.remove('dim')); });
}
function niceStep(max) { const r = max / 4, p = 10 ** Math.floor(Math.log10(r)); return [1, 2, 2.5, 5, 10].map(m => m * p).find(s => s >= r); }

// ---------- الوثائق والتأمين ----------
route(/^\/docs$/, () => {
  const docs = [...S.docs].sort((a, b) => (b.end || '').localeCompare(a.end || ''));
  const st = d => {
    if (!d.end) return '';
    const n = daysTo(d.end);
    return n < 0 ? `<span class="badge danger">منتهية</span>` : n <= 30 ? `<span class="badge warn">باقي ${rel(n)}</span>` : `<span class="badge ok">سارية · ${rel(n)}</span>`;
  };
  return `${header('التأمين والوثائق', 'تأمين، استمارة، فحص دوري…')}
  <div class="btns" style="grid-template-columns:1fr 1fr;margin:0 0 14px">
    <a class="btn" href="#/doc/new?type=insurance">${ic('shield')} تأمين</a>
    <a class="btn ghost" href="#/doc/new">${ic('plus')} وثيقة أخرى</a>
  </div>
  ${docs.length ? `<div class="list">${docs.map(d => {
    const t = DOC_TYPES[d.type] || DOC_TYPES.other;
    return `<a class="row" href="#/doc/${d.id}"><span class="cat-ic" style="background:var(--primary-soft);color:var(--primary)">${ic(t.i)}</span>
      <div class="grow"><div class="t">${esc(d.title || t.n)}</div><div class="s">${[d.company, d.end ? 'حتى ' + fmtD(d.end) : ''].filter(Boolean).map(esc).join(' · ')}</div></div>${st(d)}</a>`;
  }).join('')}</div>` : `<div class="card empty">${ic('shield')}<div>سجّل وثيقة التأمين وتاريخ انتهاء الاستمارة والفحص الدوري، ونذكّرك قبل انتهائها بشهر</div></div>`}`;
});
route(/^\/doc\/(\w+)$/, (id, q) => {
  const ed = id !== 'new' ? S.docs.find(x => x.id === id) : null;
  const d = ed || { type: q.type || 'insurance' };
  draftFiles = [...(d.fileIds || [])];
  then(() => bindDocForm(ed));
  return `${header(ed ? esc(d.title || DOC_TYPES[d.type]?.n) : 'وثيقة جديدة', '', true)}
  <form class="form" id="df" autocomplete="off">
    <div class="card">
      <label class="field"><span>النوع</span><select name="type">${Object.entries(DOC_TYPES).map(([k, t]) => `<option value="${k}" ${d.type === k ? 'selected' : ''}>${t.n}</option>`).join('')}</select></label>
      <label class="field"><span>العنوان</span><input name="title" value="${esc(d.title)}" placeholder="مثال: تأمين شامل ٢٠٢٦"></label>
      <label class="field" data-ins><span>شركة التأمين / الجهة</span><input name="company" value="${esc(d.company)}" placeholder="مثال: التعاونية"></label>
      <label class="field" data-ins><span>نوع التغطية</span><select name="coverage">${['', 'شامل', 'ضد الغير'].map(o => `<option ${d.coverage === o ? 'selected' : ''}>${o}</option>`).join('')}</select></label>
      <label class="field"><span>رقم الوثيقة</span><input name="number" value="${esc(d.number)}" inputmode="text"></label>
      <div class="two">
        <label class="field"><span>تاريخ البداية</span><input type="date" name="start" value="${esc(d.start)}"></label>
        <label class="field"><span>تاريخ الانتهاء</span><input type="date" name="end" value="${esc(d.end)}"></label>
      </div>
      <label class="field"><span>المبلغ المدفوع (يُحسب ضمن المصاريف)</span><div class="unit"><input name="amount" inputmode="decimal" value="${esc(d.amount)}" placeholder="0"><em>ر.س</em></div></label>
      <label class="field"><span>ملاحظات</span><textarea name="notes" placeholder="التحمل، رقم المطالبات، المزايا…">${esc(d.notes)}</textarea></label>
    </div>
    <div class="form-label">صورة الوثيقة</div>
    <div class="card"><div class="files" id="files"></div><input type="file" id="file-in" accept="image/*,application/pdf" multiple hidden></div>
    <div class="btns">
      <button class="btn" type="submit">${ic('check')} حفظ</button>
      ${ed ? `<button class="btn danger" type="button" id="del">${ic('trash')} حذف</button>` : ''}
    </div>
  </form>`;
});
function bindDocForm(ed) {
  const f = $('#df');
  const sync = () => $$('[data-ins]', f).forEach(el => el.hidden = f.type.value !== 'insurance');
  f.type.addEventListener('change', sync); sync();
  f.start.addEventListener('change', () => { if (!f.end.value && f.start.value) f.end.value = addMonths(f.start.value, 12); });
  bindFileInput();
  f.onsubmit = async e => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(f));
    const item = { id: ed?.id, ...fd, amount: num(fd.amount), fileIds: draftFiles };
    for (const k of Object.keys(item)) if (item[k] === null || item[k] === '') delete item[k];
    try { await save('docs', item); toast('تم الحفظ ✓'); go('/docs'); } catch (err) { toast(err.message); }
  };
  $('#del')?.addEventListener('click', async () => {
    if (!confirm('حذف الوثيقة ومرفقاتها؟')) return;
    try { await remove('docs', ed.id); go('/docs'); } catch (err) { toast(err.message); }
  });
}

// ---------- السيارة والإعدادات ----------
route(/^\/car$/, () => {
  const c = car(), odo = currentOdo();
  const spec = (k, v, cls = '') => `<div class="spec"><span>${k}</span><b class="${cls}">${v ? esc(v) : '<span class="muted">—</span>'}</b></div>`;
  return `${header('سيارتي')}
  <div class="hero" style="text-align:center">
    <img class="hero-car" src="/img/car.png" alt="">
    <div class="hero-road"></div>
    <div class="hero-name">${esc(c.make)} ${esc(c.model)} <span class="num">${c.year}</span></div>
    <div style="margin:10px 0 4px">${plate(true)}</div>
  </div>
  <div class="sec-title">البيانات</div>
  <div class="spec-grid">
    ${spec('رقم الهيكل (الشاصي)', c.vin, 'vin')}${spec('الرقم التسلسلي', c.serial, 'vin')}
    ${spec('اللون', c.color)}${spec('المحرك', c.engine)}
    ${spec('الزيت', c.oilSpec)}${spec('البنزين', c.fuelGrade + ' · خزان ' + c.tankL + ' لتر')}
    ${spec('مقاس الإطارات', c.tireSize)}${spec('مقاس البطارية', c.batterySize)}
    ${spec('العداد الحالي', odo ? NF0.format(odo) + ' كم' : '')}${spec('تغيير الزيت كل', NF0.format(c.oilInterval) + ' كم')}
  </div>
  <div class="btns">
    <button class="btn" onclick="odoSheet()">${ic('gauge')} تحديث قراءة العداد</button>
    <a class="btn ghost" href="#/car/edit">${ic('edit')} تعديل بيانات السيارة</a>
    <a class="btn ghost" href="#/fuel">${ic('fuel')} سجل الوقود والاستهلاك</a>
  </div>
  <div class="sec-title">النسخ الاحتياطي</div>
  <div class="card small muted" style="line-height:1.8">بياناتك محفوظة على الخادم في قاعدة بيانات، فلا تضيع لو غيّرت جوالك أو فرمته. وللاحتياط أكثر تقدر تنزّل نسخة كاملة (مع صور الفواتير) وتحفظها في ملفاتك.</div>
  <div class="btns" style="grid-template-columns:1fr 1fr">
    <button class="btn ghost" onclick="doExport()">${ic('download')} تنزيل نسخة</button>
    <button class="btn ghost" onclick="$('#imp').click()">${ic('upload')} استرجاع</button>
  </div>
  <input type="file" id="imp" accept="application/json,.json" hidden onchange="doImport(this.files[0])">
  <div class="btns"><button class="btn danger" onclick="if(confirm('تسجيل الخروج من هذا الجهاز؟')) logout()">${ic('logout')} تسجيل الخروج</button></div>
  <p class="center small muted" style="margin-top:20px">أوريوني · صُمّم خصيصًا لسيارتك</p>`;
});
route(/^\/car\/edit$/, () => {
  const c = car();
  const F = (k, label, attrs = '') => `<label class="field"><span>${label}</span><input name="${k}" value="${esc(c[k])}" ${attrs}></label>`;
  then(() => {
    $('#cf').onsubmit = async e => {
      e.preventDefault();
      const data = { ...c, ...Object.fromEntries(new FormData(e.target)) };
      data.year = num(data.year) || 2015; data.oilInterval = num(data.oilInterval) || 5000; data.tankL = num(data.tankL) || 70;
      try { S.car = await api('PUT', '/api/car', data); toast('تم الحفظ ✓'); go('/car'); } catch (err) { toast(err.message); }
    };
  });
  return `${header('بيانات السيارة')}
  <form class="form" id="cf"><div class="card">
    <div class="two">${F('make', 'الشركة')}${F('model', 'الطراز')}</div>
    <div class="two">${F('year', 'سنة الصنع', 'inputmode="numeric"')}${F('color', 'اللون')}</div>
    ${F('vin', 'رقم الهيكل (الشاصي)', 'dir="ltr" style="text-align:right"')}
    ${F('serial', 'الرقم التسلسلي', 'inputmode="numeric"')}
    <div class="two">${F('plateAr', 'حروف اللوحة (عربي)')}${F('plateEn', 'حروف اللوحة (إنجليزي)')}</div>
    ${F('plateNum', 'أرقام اللوحة', 'inputmode="numeric"')}
    ${F('engine', 'المحرك')}
    ${F('oilSpec', 'مواصفات الزيت')}
    <div class="two">${F('oilInterval', 'تغيير الزيت كل (كم)', 'inputmode="numeric"')}${F('fuelGrade', 'نوع البنزين')}</div>
    <div class="two">${F('tireSize', 'مقاس الإطارات', 'placeholder="مثال: 215/55R17"')}${F('batterySize', 'مقاس البطارية', 'placeholder="مثال: 70 أمبير"')}</div>
    <div class="two">${F('tankL', 'سعة الخزان (لتر)', 'inputmode="numeric"')}${F('purchaseOdo', 'العداد عند الشراء', 'inputmode="numeric"')}</div>
  </div><div class="btns"><button class="btn" type="submit">${ic('check')} حفظ</button></div></form>`;
});

window.odoSheet = () => sheet(`<h3>قراءة العداد الآن</h3>
  <form id="of" class="form"><div class="card">
    <label class="field"><span>الكيلومترات</span><div class="unit"><input name="odo" inputmode="numeric" placeholder="${NF0.format(currentOdo())}" required autofocus><em>كم</em></div></label>
    <label class="field"><span>التاريخ</span><input type="date" name="date" value="${today()}"></label>
  </div><div class="btns"><button class="btn">${ic('check')} حفظ</button></div></form>`, el => {
  $('#of', el).onsubmit = async e => {
    e.preventDefault();
    const v = num(e.target.odo.value); if (!v) return;
    try { await save('odo', { odo: v, date: e.target.date.value || today() }); closeSheet(); toast('تم تحديث العداد ✓'); render(); } catch (err) { toast(err.message); }
  };
});

window.doExport = async () => {
  try {
    toast('جارٍ تجهيز النسخة…');
    const r = await fetch('/api/export', { headers: { Authorization: 'Bearer ' + token } });
    if (!r.ok) throw new Error('تعذّر التنزيل');
    const blob = await r.blob();
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `aurion-backup-${today()}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  } catch (e) { toast(e.message); }
};
window.doImport = async file => {
  if (!file) return;
  if (!confirm('استرجاع النسخة؟ ستُضاف بياناتها وتُحدَّث العناصر المتطابقة.')) return;
  try {
    const data = JSON.parse(await file.text());
    const r = await api('POST', '/api/import', data);
    await load(); toast(`تم استرجاع ${r.items} عنصر و${r.files} ملف`); render();
  } catch (e) { toast(e.message || 'ملف غير صالح'); }
};

// ---------- الورقة السفلية ----------
function sheet(html, bind) {
  closeSheet();
  const bg = document.createElement('div'); bg.className = 'sheet-bg'; bg.onclick = closeSheet;
  const s = document.createElement('div'); s.className = 'sheet'; s.innerHTML = `<div class="grab"></div>${html}`;
  document.body.append(bg, s); bind?.(s);
}
function closeSheet() { $$('.sheet, .sheet-bg').forEach(e => e.remove()); }
window.closeSheet = closeSheet;
window.addSheet = () => sheet(`<h3>إضافة</h3><div class="actions">
  <button onclick="closeSheet();go('/add?cat=fuel')">${catIc('fuel')}<b>تعبئة وقود</b><span>لترات وسعر وعداد</span></button>
  <button onclick="closeSheet();go('/add?cat=service')">${catIc('service')}<b>صيانة / قطعة</b><span>فاتورة مع ضمان</span></button>
  <button onclick="closeSheet();go('/doc/new?type=insurance')">${catIc('insurance')}<b>تأمين / وثيقة</b><span>استمارة، فحص دوري</span></button>
  <button onclick="closeSheet();odoSheet()"><span class="cat-ic" style="background:#3D47661f;color:var(--ink-2)">${ic('gauge')}</span><b>قراءة العداد</b><span>تحديث الكيلومترات</span></button>
  <button onclick="closeSheet();go('/add?cat=wash')">${catIc('wash')}<b>غسيل وعناية</b><span>مصروف سريع</span></button>
  <button onclick="closeSheet();go('/add?cat=fines')">${catIc('fines')}<b>مخالفة</b><span>ساهر وغيرها</span></button>
</div>`);

// ---------- الدخول والتشغيل ----------
function logout() { token = ''; localStorage.removeItem(TK); localStorage.removeItem(SK); showLogin(); }
window.logout = logout;
function showLogin() {
  $('.tabbar').hidden = true;
  $('#view').innerHTML = '';
  const l = document.createElement('div'); l.className = 'login'; l.id = 'login';
  l.innerHTML = `<img src="/img/car.png" alt=""><h1>أوريوني</h1><p>سجل سيارتك في مكان واحد</p>
    <form><input type="password" inputmode="numeric" autocomplete="current-password" placeholder="••••" aria-label="الرمز السري" required>
    <br><button>دخول</button><div class="err"></div></form>`;
  document.body.appendChild(l);
  const f = $('form', l), inp = $('input', l);
  setTimeout(() => inp.focus(), 300);
  f.onsubmit = async e => {
    e.preventDefault();
    try {
      const r = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin: inp.value }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      token = j.token; localStorage.setItem(TK, token); l.remove(); start();
    } catch (err) { $('.err', l).textContent = err.message || 'تعذّر الدخول'; inp.value = ''; }
  };
}
async function start() {
  if (!token) return showLogin();
  try { await load(); } catch (e) { if (token) { $('#view').innerHTML = `<div class="empty">${ic('alert')}<div>تعذّر الاتصال بالخادم<br><button class="btn ghost" style="margin-top:14px" onclick="start()">إعادة المحاولة</button></div></div>`; } return; }
  $('.tabbar').hidden = false;
  render();
}
window.start = start;
window.go = go;
window.$ = $;

$('.tabbar').innerHTML = `
  <a href="#/" data-tab="home">${ic('home')}الرئيسية</a>
  <a href="#/log" data-tab="log">${ic('list')}السجل</a>
  <button class="fab" onclick="addSheet()" aria-label="إضافة">${ic('plus')}</button>
  <a href="#/warranty" data-tab="warranty">${ic('shield')}الضمانات</a>
  <a href="#/reports" data-tab="reports">${ic('chart')}التقارير</a>`;
start();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
