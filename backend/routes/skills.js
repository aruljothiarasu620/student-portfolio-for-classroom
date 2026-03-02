const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const { authMiddleware, checkRole } = require('../middleware/auth');

// @route   GET api/students/:studentId/skills
// @desc    List skills of a student (public)
// @access  Public
router.get('/:studentId/skills', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM skills WHERE student_id = ?', [req.params.studentId]);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/skills
// @desc    Add a skill for the authenticated student
// @access  Private, student only
router.post('/', authMiddleware, checkRole('student'), async (req, res) => {
    const { skill_name } = req.body;

    try {
        const [studentRows] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        if (studentRows.length === 0) {
            return res.status(404).json({ msg: 'Student record not found' });
        }

        const [result] = await pool.execute(
            'INSERT INTO skills (student_id, skill_name) VALUES (?, ?)',
            [studentRows[0].id, skill_name]
        );

        const [newSkill] = await pool.execute('SELECT * FROM skills WHERE id = ?', [result.insertId]);
        res.json(newSkill[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/skills/:id
// @desc    Remove a skill
// @access  Private, student only
router.delete('/:id', authMiddleware, checkRole('student'), async (req, res) => {
    try {
        const [studentRows] = await pool.execute('SELECT id FROM students WHERE user_id = ?', [req.user.id]);
        const [skillRows] = await pool.execute('SELECT * FROM skills WHERE id = ?', [req.params.id]);

        if (skillRows.length === 0) {
            return res.status(404).json({ msg: 'Skill not found' });
        }

        if (skillRows[0].student_id !== studentRows[0].id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await pool.execute('DELETE FROM skills WHERE id = ?', [req.params.id]);
        res.json({ msg: 'Skill removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
