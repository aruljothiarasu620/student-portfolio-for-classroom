const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function checkDB() {
    console.log('Connecting with:', {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME
    });

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'students_portfolio'
        });

        console.log('Connection successful!');

        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables in DB:', tables);

        const tablesNeeded = ['users', 'classes', 'students', 'projects', 'skills'];
        const tablesPresent = tables.map(t => Object.values(t)[0]);

        for (const table of tablesNeeded) {
            if (!tablesPresent.includes(table)) {
                console.error(`MISSING TABLE: ${table}`);
            }
        }

        await connection.end();
    } catch (err) {
        console.error('DATABASE ERROR:', err.message);
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('REASON: Database does not exist.');
        } else if (err.code === 'ECONNREFUSED') {
            console.log('REASON: MySQL server is not running or port is wrong.');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('REASON: Wrong username or password.');
        }
    }
}

checkDB();
