const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authMiddleware, checkRole } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// @route   GET api/students
// @desc    List all students (optionally by class_id)
// @access  Public
router.get('/', async (req, res) => {
    const { class_id } = req.query;
    let sql = 'SELECT * FROM students';
    let params = [];

    if (class_id) {
        sql += ' WHERE class_id = ?';
        params.push(class_id);
    }

    try {
        const [rows] = await pool.execute(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/students/:id
// @desc    Get profile of a student (with projects & skills)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const [studentRows] = await pool.execute('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (studentRows.length === 0) {
            return res.status(404).json({ msg: 'Student not found' });
        }

        const [projectRows] = await pool.execute('SELECT * FROM projects WHERE student_id = ?', [req.params.id]);
        const [skillRows] = await pool.execute('SELECT * FROM skills WHERE student_id = ?', [req.params.id]);

        const student = {
            ...studentRows[0],
            projects: projectRows,
            skills: skillRows
        };

        res.json(student);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/students/me
// @desc    Update own student profile
// @access  Private, student only
router.put('/me', authMiddleware, checkRole('student'), async (req, res) => {
    const { full_name, bio, class_id, contact_email, avatar_url } = req.body;

    try {
        // Check if the student record already exists for the user
        const [existing] = await pool.execute('SELECT * FROM students WHERE user_id = ?', [req.user.id]);

        if (existing.length === 0) {
            // Create a student record if it doesn't exist
            await pool.execute(
                'INSERT INTO students (user_id, full_name, bio, class_id, contact_email, avatar_url) VALUES (?, ?, ?, ?, ?, ?)',
                [req.user.id, full_name, bio || '', class_id || 1, contact_email || '', avatar_url || '']
            );
        } else {
            // Update existing record
            await pool.execute(
                'UPDATE students SET full_name = ?, bio = ?, class_id = ?, contact_email = ?, avatar_url = ? WHERE user_id = ?',
                [full_name, bio, class_id, contact_email, avatar_url, req.user.id]
            );
        }

        const [updated] = await pool.execute('SELECT * FROM students WHERE user_id = ?', [req.user.id]);
        res.json(updated[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/students/me/avatar
// @desc    Upload avatar
// @access  Private, student only
router.post('/me/avatar', authMiddleware, checkRole('student'), (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        }
        if (!req.file) {
            return res.status(400).json({ msg: 'No file selected' });
        }

        try {
            const avatarUrl = `/uploads/${req.file.filename}`;
            await pool.execute('UPDATE students SET avatar_url = ? WHERE user_id = ?', [avatarUrl, req.user.id]);
            res.json({ avatar_url: avatarUrl });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });
});

module.exports = router;
