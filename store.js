// طبقة التخزين: PostgreSQL على الخادم (DATABASE_URL)، أو ملفات محلية للتجربة على الجهاز
const fs = require('fs');
const path = require('path');

const url = process.env.DATABASE_URL;

function pgStore() {
  const { Pool } = require('pg');
  const local = /localhost|127\.0\.0\.1|\.internal|^postgres(ql)?:\/\/[^@]+@dpg-[a-z0-9-]+\//.test(url);
  const pool = new Pool({ connectionString: url, ssl: local ? false : { rejectUnauthorized: false }, max: 5 });
  return {
    kind: 'postgres',
    async init() {
      await pool.query(`
        create table if not exists items (
          coll text not null, id text not null, data jsonb not null,
          updated_at timestamptz not null default now(), primary key (coll, id));
        create table if not exists files (
          id text primary key, name text, mime text, size int,
          created_at timestamptz not null default now(), data bytea not null);`);
    },
    async list(coll) { return (await pool.query('select data from items where coll=$1', [coll])).rows.map(r => r.data); },
    async get(coll, id) { return (await pool.query('select data from items where coll=$1 and id=$2', [coll, id])).rows[0]?.data || null; },
    async put(coll, id, data) {
      await pool.query(`insert into items (coll,id,data,updated_at) values ($1,$2,$3,now())
        on conflict (coll,id) do update set data=excluded.data, updated_at=now()`, [coll, id, data]);
      return data;
    },
    async del(coll, id) { await pool.query('delete from items where coll=$1 and id=$2', [coll, id]); },
    async listFiles() {
      return (await pool.query('select id,name,mime,size,created_at from files')).rows
        .map(r => ({ id: r.id, name: r.name, mime: r.mime, size: r.size, createdAt: r.created_at }));
    },
    async putFile(m, buf) {
      await pool.query(`insert into files (id,name,mime,size,created_at,data) values ($1,$2,$3,$4,coalesce($5::timestamptz,now()),$6)
        on conflict (id) do nothing`, [m.id, m.name, m.mime, m.size, m.createdAt || null, buf]);
    },
    async getFile(id) { return (await pool.query('select name,mime,data from files where id=$1', [id])).rows[0] || null; },
    async delFile(id) { await pool.query('delete from files where id=$1', [id]); }
  };
}

function fileStore() {
  const dir = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'));
  const fdir = path.join(dir, 'files');
  const dbFile = path.join(dir, 'db.json');
  let db = { items: {}, files: {} };
  const save = () => { fs.writeFileSync(dbFile + '.tmp', JSON.stringify(db)); fs.renameSync(dbFile + '.tmp', dbFile); };
  const bucket = c => (db.items[c] ||= {});
  return {
    kind: 'file:' + dir,
    async init() {
      fs.mkdirSync(fdir, { recursive: true });
      try { db = JSON.parse(fs.readFileSync(dbFile, 'utf8')); } catch {}
    },
    async list(c) { return Object.values(bucket(c)); },
    async get(c, id) { return bucket(c)[id] || null; },
    async put(c, id, data) { bucket(c)[id] = data; save(); return data; },
    async del(c, id) { delete bucket(c)[id]; save(); },
    async listFiles() { return Object.values(db.files); },
    async putFile(m, buf) { fs.writeFileSync(path.join(fdir, m.id), buf); db.files[m.id] = m; save(); },
    async getFile(id) {
      const m = db.files[id]; if (!m) return null;
      return { ...m, data: fs.readFileSync(path.join(fdir, id)) };
    },
    async delFile(id) { delete db.files[id]; try { fs.unlinkSync(path.join(fdir, id)); } catch {} save(); }
  };
}

module.exports = url ? pgStore() : fileStore();
