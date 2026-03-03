const path = require('path');
const { Pool } = require('pg');

let mode = 'sqlite';
let pgPool;
let db; // SQLite

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
  mode = 'pg';
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log('DB Mode: PostgreSQL');
} else {
  console.log('DB Mode: SQLite');
}

const connectDB = async () => {
  if (mode === 'pg') {
    if (!pgPool) {
      console.error('No pgPool available!');
      return;
    }
    try {
      const client = await pgPool.connect();
      console.log('PostgreSQL (Neon) Connected...');
      client.release();
    } catch (err) {
      console.error('PostgreSQL connection error:', err.message);
    }
  } else {
    try {
      const sqlite3 = require('sqlite3');
      const { open } = require('sqlite');
      if (!db) {
        db = await open({
          filename: path.join(__dirname, '../database.sqlite'),
          driver: sqlite3.Database,
        });
        console.log('SQLite Connected...');
      }
    } catch (err) {
      console.error('SQLite connection error:', err.message);
    }
  }
};

const pool = {
  execute: async (sql, params = []) => {
    if (mode === 'pg') {
      let pgSql = sql;
      let count = 1;
      while (pgSql.includes('?')) {
        pgSql = pgSql.replace('?', `$${count++}`);
      }

      const isInsert = sql.trim().toUpperCase().startsWith('INSERT');
      if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
        pgSql += ' RETURNING id';
      }

      try {
        const res = await pgPool.query(pgSql, params);
        if (isInsert && res.rows.length > 0) {
          return [{ insertId: res.rows[0].id }, null];
        }
        return [res.rows, null];
      } catch (err) {
        console.error('PG Query Error:', err.message);
        throw err;
      }
    } else {
      // SQLite
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const rows = await db.all(sql, params);
        return [rows, null];
      } else {
        const result = await db.run(sql, params);
        return [Object.assign(result, { insertId: result.lastID }), null];
      }
    }
  }
};

module.exports = { pool, connectDB };

