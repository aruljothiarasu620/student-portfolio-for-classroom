const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_IDq1CwYFkyV0@ep-empty-bonus-aire3p4t-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
});

async function checkUsers() {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT COUNT(*) FROM users');
        console.log('User count:', res.rows[0].count);
        const users = await client.query('SELECT email FROM users LIMIT 10');
        console.log('Users:', users.rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        client.release();
        process.exit();
    }
}

checkUsers();
