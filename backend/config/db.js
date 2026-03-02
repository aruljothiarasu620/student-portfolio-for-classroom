const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
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
    try {
      const client = await pgPool.connect();
      console.log('PostgreSQL (Neon) Connected...');

      // Initialize Schema for Postgres
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) CHECK(role IN ('student', 'teacher')) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS classes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          teacher_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS students (
          id SERIAL PRIMARY KEY,
          user_id INTEGER UNIQUE NOT NULL,
          class_id INTEGER NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          bio TEXT,
          avatar_url VARCHAR(500),
          contact_email VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image_url VARCHAR(500),
          project_link VARCHAR(500),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS skills (
          id SERIAL PRIMARY KEY,
          student_id INTEGER NOT NULL,
          skill_name VARCHAR(100) NOT NULL,
          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
        );
      `);

      const res = await client.query('SELECT COUNT(*) FROM classes');
      if (parseInt(res.rows[0].count) === 0) {
        await client.query('INSERT INTO classes (name, description) VALUES ($1, $2)', ['Web Development 2025', 'General Web Development course']);
      }

      client.release();
      console.log('PostgreSQL Schema Initialized.');
    } catch (err) {
      console.error('PostgreSQL connection error:', err.message);
      process.exit(1);
    }
  } else {
    // SQLite Fallback (Local)
    try {
      db = await open({
        filename: path.join(__dirname, '../database.sqlite'),
        driver: sqlite3.Database,
      });
      console.log('SQLite Connected...');
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, teacher_id INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER UNIQUE NOT NULL, class_id INTEGER NOT NULL, full_name TEXT NOT NULL, bio TEXT, avatar_url TEXT, contact_email TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER NOT NULL, title TEXT NOT NULL, description TEXT, image_url TEXT, project_link TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS skills (id INTEGER PRIMARY KEY AUTOINCREMENT, student_id INTEGER NOT NULL, skill_name TEXT NOT NULL);
      `);
      console.log('SQLite Schema Initialized.');
    } catch (err) {
      console.error('SQLite connection error:', err.message);
      process.exit(1);
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
