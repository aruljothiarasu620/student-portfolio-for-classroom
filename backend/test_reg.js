const axios = require('axios');

async function testRegistration() {
    try {
        console.log('Testing registration at http://localhost:5000/api/auth/register...');
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            email: 'test' + Date.now() + '@example.com',
            password: 'password123',
            role: 'student'
        });
        console.log('Registration Success:', res.data);
    } catch (err) {
        console.error('Registration Failed:', err.response ? err.response.data : err.message);
    }
}

testRegistration();
