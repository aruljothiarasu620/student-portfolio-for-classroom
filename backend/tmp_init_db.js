const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_IDq1CwYFkyV0@ep-empty-bonus-aire3p4t-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  const client = await pool.connect();
  try {
    console.log('Initializing schema...');
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
    console.log('Schema initialized successfully!');
  } catch (err) {
    console.error('Schema initialization error:', err);
  } finally {
    client.release();
    process.exit();
  }
}

initDB();
