const pool = require('../../config/db');

exports.gitTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM tasks WHERE id = $1',
            [id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        // Fixed: Return the task data directly at the root level to match frontend expectations
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};