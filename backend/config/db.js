const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db;

const connectDB = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, '../database.sqlite'),
      driver: sqlite3.Database,
    });

    console.log('SQLite Connected...');

    // Initialize Schema
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT CHECK(role IN ('student', 'teacher')) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        teacher_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        class_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        bio TEXT,
        avatar_url TEXT,
        contact_email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        project_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        skill_name TEXT NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      );
    `);

    // Insert a default class if it doesn't exist
    const classCount = await db.get('SELECT COUNT(*) as count FROM classes');
    if (classCount.count === 0) {
      await db.run('INSERT INTO classes (name, description) VALUES (?, ?)', ['Web Development 2025', 'General Web Development course']);
      console.log('Default class added.');
    }

    console.log('SQLite Schema Initialized.');
  } catch (err) {
    console.error('SQLite connection error:', err.message);
    process.exit(1);
  }
};

// Wrapper object for MySQL-style queries during the transition
const pool = {
  execute: async (sql, params = []) => {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = await db.all(sql, params);
      return [rows, null];
    } else {
      const result = await db.run(sql, params);
      return [Object.assign(result, { insertId: result.lastID }), null];
    }
  }
};

module.exports = { pool, connectDB };
