const pool = require('../../config/db');


exports.getAllCommunity = async (req, res) => {
    try {
            const query = `
                SELECT cf.id, cf.feedback, cf.rating, cf.created_at, u.username
                FROM community_feedback cf
                JOIN users u ON cf.user_id = u.id
                ORDER BY cf.created_at DESC;
            `;

        const result = await pool.query(query);
        res.status(200).json({ feedbacks: result.rows });
    } catch (error) {
        console.error('Error fetching community feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}