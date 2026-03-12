const express = require('express');
const { pool } = require('../db/db');
const router = express.Router();

// GET /api/profiles/me
router.get('/me', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [req.user.sub]);
        if (result.rows.length === 0) {
            // If profile doesn't exist yet, create an empty one
            const newProfile = await pool.query(
                'INSERT INTO profiles (user_id, full_name) VALUES ($1, $2) RETURNING *',
                [req.user.sub, req.user.username]
            );
            return res.json(newProfile.rows[0]);
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('[PROFILE] GET error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/profiles/me
router.put('/me', async (req, res) => {
    const { full_name, bio, avatar_url } = req.body;
    try {
        const result = await pool.query(
            `UPDATE profiles 
             SET full_name = COALESCE($1, full_name), 
                 bio = COALESCE($2, bio), 
                 avatar_url = COALESCE($3, avatar_url),
                 updated_at = NOW()
             WHERE user_id = $4 RETURNING *`,
            [full_name, bio, avatar_url, req.user.sub]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('[PROFILE] PUT error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Health check
router.get('/health', (_, res) => res.json({ status: 'ok', service: 'user-service' }));

module.exports = router;
