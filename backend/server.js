const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();

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

const initializeApp = async () => {
    // Connect to Database
    await connectDB();
};

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    initializeApp().then(() => {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    }).catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });
} else {
    // For Vercel, we need to initialize and then export
    // Vercel handles the await if we export a handler, but Express apps are usually synchronous in setup
    // Since connectDB is async, we might need a wrapper if we want to ensure DB is connected
    initializeApp();
}

module.exports = app;
