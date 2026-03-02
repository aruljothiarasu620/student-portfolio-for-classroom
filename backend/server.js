const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

const startServer = async () => {
    // Connect to Database
    await connectDB();

    // Init Middleware
    app.use(cors());
    app.use(express.json({ extended: false }));
    app.use('/uploads', express.static('uploads'));

    // Define Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/students', require('./routes/students'));
    app.use('/api/projects', require('./routes/projects'));
    app.use('/api/skills', require('./routes/skills'));
    app.use('/api/classes', require('./routes/classes'));

    // Simple testing route
    app.get('/', (req, res) => res.send('API Running'));

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
