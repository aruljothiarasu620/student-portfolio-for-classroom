const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authMiddleware, checkRole } = require('../middleware/auth');

// @route   GET api/classes
// @desc    List all classes
// @access  Public
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM classes');
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/classes/:id
// @desc    Get class details with list of students
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const [classRows] = await pool.execute('SELECT * FROM classes WHERE id = ?', [req.params.id]);
        if (classRows.length === 0) {
            return res.status(404).json({ msg: 'Class not found' });
        }

        const [studentRows] = await pool.execute('SELECT * FROM students WHERE class_id = ?', [req.params.id]);
        const classData = {
            ...classRows[0],
            students: studentRows
        };

        res.json(classData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/classes
// @desc    Create a new class
// @access  Private, teacher only
router.post('/', authMiddleware, checkRole('teacher'), async (req, res) => {
    const { name, description } = req.body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO classes (name, description, teacher_id) VALUES (?, ?, ?)',
            [name, description, req.user.id]
        );

        const [newClass] = await pool.execute('SELECT * FROM classes WHERE id = ?', [result.insertId]);
        res.json(newClass[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/classes/:id
// @desc    Update class
// @access  Private, teacher only
router.put('/:id', authMiddleware, checkRole('teacher'), async (req, res) => {
    const { name, description } = req.body;

    try {
        const [classRows] = await pool.execute('SELECT * FROM classes WHERE id = ?', [req.params.id]);
        if (classRows.length === 0) {
            return res.status(404).json({ msg: 'Class not found' });
        }

        if (classRows[0].teacher_id !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await pool.execute(
            'UPDATE classes SET name = ?, description = ? WHERE id = ?',
            [name, description, req.params.id]
        );

        const [updatedClass] = await pool.execute('SELECT * FROM classes WHERE id = ?', [req.params.id]);
        res.json(updatedClass[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
