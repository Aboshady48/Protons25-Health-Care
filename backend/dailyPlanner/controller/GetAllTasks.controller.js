const pool = require('../../config/db');

exports.getAllTasks = async (req, res) => { 
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY completed ASC, priority DESC, created_at DESC',
            [userId]
        );
        res.status(200).json({ tasks: result.rows });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
