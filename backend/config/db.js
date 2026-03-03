const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

let db; // SQLite connection
let pgPool; // PostgreSQL pool
let mode = 'sqlite'; // 'sqlite' or 'pg'

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
  mode = 'pg';
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}


const connectDB = async () => {
  if (mode === 'pg') {
    if (!pgPool) return;
    try {
      // We don't necessarily need to connect immediately just to check, 
      // but we can if we want to initialize the schema.
      // Already initialized via local script, but safe to keep.
      const client = await pgPool.connect();
      console.log('PostgreSQL (Neon) Connected...');
      client.release();
    } catch (err) {
      console.error('PostgreSQL connection error:', err.message);
      // Don't exit process in production/vercel
    }
  } else {
    // SQLite Fallback (Local)
    try {
      if (!db) {
        const sqlite3 = require('sqlite3');
        const { open } = require('sqlite');
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
      // Convert MySQL '?' to PostgreSQL '$1, $2...'
      let pgSql = sql;
      let count = 1;
      while (pgSql.includes('?')) {
        pgSql = pgSql.replace('?', `$${count++}`);
      }

      // If it's an INSERT, we often need the last ID. 
      // In the app, it's used as res[0].insertId. 
      // We append RETURNING id if it's an INSERT.
      const isInsert = sql.trim().toUpperCase().startsWith('INSERT');
      if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
        pgSql += ' RETURNING id';
      }

      const res = await pgPool.query(pgSql, params);

      if (isInsert && res.rows.length > 0) {
        return [{ insertId: res.rows[0].id }, null];
      }
      return [res.rows, null];
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
