const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function initDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    console.log('Connected to MySQL server.');

    try {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'students_portfolio'}`);
        console.log(`Database ${process.env.DB_NAME || 'students_portfolio'} ensured.`);

        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'students_portfolio',
        });

        const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS classes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        teacher_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE NOT NULL,
        class_id INT NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar_url VARCHAR(500),
        contact_email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500),
        project_link VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        skill_name VARCHAR(100) NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      );
    `;

        const queries = schema.split(';').filter(q => q.trim());
        for (let query of queries) {
            await pool.query(query);
        }
        console.log('Tables initialized/ensured.');

        // Check if any classes exist, if not create one
        const [rows] = await pool.query('SELECT * FROM classes');
        if (rows.length === 0) {
            await pool.query('INSERT INTO classes (name, description) VALUES (?, ?)', ['Web Development 101', 'Introductory web development course']);
            console.log('Initial class created.');
        }

        await pool.end();
    } catch (err) {
        console.error('Error during DB init:', err);
    } finally {
        await connection.end();
    }
}

initDB();
