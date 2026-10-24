// خادم تطبيق «أوريوني» — سجل السيارة: المصاريف، الوقود، الضمانات، الوثائق والفواتير
process.env.TZ = process.env.TZ || 'Asia/Riyadh';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const multer = require('multer');
const store = require('./store');

const PORT = Number(process.env.PORT || 3000);
const APP_PIN = String(process.env.APP_PIN || '1234');
const SECRET = process.env.APP_SECRET || 'local-dev-secret';
if (!process.env.APP_PIN) console.warn('⚠️  لم يتم ضبط APP_PIN — الرمز الافتراضي 1234.');

// رمز الجلسة مشتق من الرمز السري: تغيير APP_PIN يُخرج كل الأجهزة
const TOKEN = crypto.createHmac('sha256', SECRET).update('pin:' + APP_PIN).digest('hex').slice(0, 40);

let CAR_DEFAULTS = null;
try { CAR_DEFAULTS = JSON.parse(process.env.CAR_DEFAULTS || 'null'); } catch { console.warn('CAR_DEFAULTS ليس JSON صالحًا'); }

// المجموعات المسموحة وما يُحفظ فيها
const COLLECTIONS = ['records', 'docs', 'odo'];
const MAX_ITEM = 64 * 1024;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(express.json({ limit: '60mb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders(res, p) {
    if (/\.(html|js|css|webmanifest)$/.test(p)) res.setHeader('Cache-Control', 'no-cache');
    if (p.endsWith('.webmanifest')) res.setHeader('Content-Type', 'application/manifest+json');
  }
}));

// ---------- الدخول ----------
const attempts = new Map();
app.post('/api/login', (req, res) => {
  const ip = req.ip;
  const a = attempts.get(ip) || { n: 0, until: 0 };
  if (a.until > Date.now()) return res.status(429).json({ error: 'محاولات كثيرة، حاول بعد خمس دقائق' });
  const pin = String(req.body?.pin || '');
  const ok = pin.length === APP_PIN.length && crypto.timingSafeEqual(Buffer.from(pin), Buffer.from(APP_PIN));
  if (!ok) {
    a.n++; if (a.n >= 5) { a.until = Date.now() + 5 * 60e3; a.n = 0; }
    attempts.set(ip, a);
    return res.status(401).json({ error: 'الرمز غير صحيح' });
  }
  attempts.delete(ip);
  res.json({ token: TOKEN });
});

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const t = String(h.startsWith('Bearer ') ? h.slice(7) : (req.query.t || ''));
  if (t.length === TOKEN.length && crypto.timingSafeEqual(Buffer.from(t), Buffer.from(TOKEN))) return next();
  res.status(401).json({ error: 'unauthorized' });
}
const wrap = fn => (req, res) => fn(req, res).catch(e => { console.error(e); res.status(500).json({ error: 'خطأ في الخادم' }); });

// ---------- البيانات ----------
app.get('/api/state', auth, wrap(async (req, res) => {
  const out = { serverTime: new Date().toISOString() };
  for (const c of COLLECTIONS) out[c] = await store.list(c);
  // بيانات السيارة الشخصية (الشاصي واللوحة) تأتي من متغير بيئة حتى لا تكون في الكود العام
  out.car = (await store.get('meta', 'car')) || CAR_DEFAULTS;
  out.files = await store.listFiles();
  res.json(out);
}));

function clean(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const { id, createdAt, updatedAt, ...rest } = body;
  if (JSON.stringify(rest).length > MAX_ITEM) return null;
  return rest;
}

app.put('/api/car', auth, wrap(async (req, res) => {
  const data = clean(req.body);
  if (!data) return res.status(400).json({ error: 'بيانات غير صالحة' });
  res.json(await store.put('meta', 'car', { id: 'car', ...data, updatedAt: new Date().toISOString() }));
}));

app.post('/api/:coll(records|docs|odo)', auth, wrap(async (req, res) => {
  const { coll } = req.params;
  if (!COLLECTIONS.includes(coll)) return res.status(404).json({ error: 'not found' });
  const data = clean(req.body);
  if (!data) return res.status(400).json({ error: 'بيانات غير صالحة' });
  const now = new Date().toISOString();
  const item = { id: crypto.randomBytes(8).toString('hex'), ...data, createdAt: now, updatedAt: now };
  res.json(await store.put(coll, item.id, item));
}));

app.put('/api/:coll(records|docs|odo)/:id', auth, wrap(async (req, res) => {
  const { coll, id } = req.params;
  if (!COLLECTIONS.includes(coll)) return res.status(404).json({ error: 'not found' });
  const old = await store.get(coll, id);
  if (!old) return res.status(404).json({ error: 'not found' });
  const data = clean(req.body);
  if (!data) return res.status(400).json({ error: 'بيانات غير صالحة' });
  res.json(await store.put(coll, id, { ...data, id, createdAt: old.createdAt, updatedAt: new Date().toISOString() }));
}));

app.delete('/api/:coll(records|docs|odo)/:id', auth, wrap(async (req, res) => {
  const { coll, id } = req.params;
  if (!COLLECTIONS.includes(coll)) return res.status(404).json({ error: 'not found' });
  const old = await store.get(coll, id);
  await store.del(coll, id);
  // احذف مرفقاته معه
  for (const f of old?.fileIds || []) await store.delFile(f);
  res.json({ ok: true });
}));

// ---------- الفواتير والمرفقات ----------
const OK_MIME = /^(image\/(jpeg|png|webp|heic|heif|gif)|application\/pdf)$/;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024, files: 10 } });

app.post('/api/files', auth, upload.array('files', 10), wrap(async (req, res) => {
  const out = [];
  for (const f of req.files || []) {
    if (!OK_MIME.test(f.mimetype)) continue;
    const meta = {
      id: crypto.randomBytes(10).toString('hex'),
      name: Buffer.from(f.originalname || 'file', 'latin1').toString('utf8').slice(0, 120),
      mime: f.mimetype, size: f.size, createdAt: new Date().toISOString()
    };
    await store.putFile(meta, f.buffer);
    out.push(meta);
  }
  res.json(out);
}));

app.get('/api/files/:id', auth, wrap(async (req, res) => {
  const f = await store.getFile(req.params.id);
  if (!f) return res.status(404).end();
  res.setHeader('Content-Type', f.mime);
  res.setHeader('Cache-Control', 'private, max-age=31536000, immutable');
  res.setHeader('Content-Disposition', `inline; filename*=UTF-8''${encodeURIComponent(f.name)}`);
  res.end(f.data);
}));

app.delete('/api/files/:id', auth, wrap(async (req, res) => {
  await store.delFile(req.params.id); res.json({ ok: true });
}));

// ---------- النسخ الاحتياطي ----------
app.get('/api/export', auth, wrap(async (req, res) => {
  const out = { app: 'aurion', version: 1, exportedAt: new Date().toISOString(), car: await store.get('meta', 'car') };
  for (const c of COLLECTIONS) out[c] = await store.list(c);
  out.files = [];
  for (const m of await store.listFiles()) {
    const f = await store.getFile(m.id);
    if (f) out.files.push({ ...m, data: f.data.toString('base64') });
  }
  res.setHeader('Content-Disposition', `attachment; filename="aurion-backup-${out.exportedAt.slice(0, 10)}.json"`);
  res.json(out);
}));

app.post('/api/import', auth, wrap(async (req, res) => {
  const b = req.body;
  if (!b || b.app !== 'aurion') return res.status(400).json({ error: 'ملف النسخة غير صالح' });
  let n = 0;
  if (b.car) await store.put('meta', 'car', b.car);
  for (const c of COLLECTIONS) for (const it of b[c] || []) { if (it?.id) { await store.put(c, it.id, it); n++; } }
  for (const f of b.files || []) {
    if (f?.id && f.data && OK_MIME.test(f.mime)) await store.putFile({ id: f.id, name: f.name, mime: f.mime, size: f.size, createdAt: f.createdAt }, Buffer.from(f.data, 'base64'));
  }
  res.json({ ok: true, items: n, files: (b.files || []).length });
}));

app.get('/healthz', (req, res) => res.send('ok'));
app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

store.init().then(() => {
  app.listen(PORT, () => console.log(`🚗 أوريوني يعمل على المنفذ ${PORT} — التخزين: ${store.kind}`));
}).catch(e => { console.error('فشل الاتصال بقاعدة البيانات', e); process.exit(1); });
