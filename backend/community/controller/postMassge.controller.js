const pool = require('../../config/db');



exports.postMessage = async (req, res) => {
    const { feedback, rating } = req.body;
    const userId = req.user.id; // from JWT

    if (!feedback || typeof feedback !== 'string' || feedback.trim() === '') {
        return res.status(400).json({ error: 'Feedback is required and must be a non-empty string.' });
    }

    if (rating && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
        return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    }

    try {
        const query = `
            INSERT INTO community_feedback (user_id, feedback, rating)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [userId, feedback.trim(), rating || null];

        const result = await pool.query(query, values);
        res.status(201).json({ 
            message: 'Feedback submitted successfully', 
            feedback: result.rows[0] 
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}