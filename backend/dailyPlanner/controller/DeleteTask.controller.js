const pool = require('../../config/db');

exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        }
        res.status(200).json({ message: 'Task deleted successfully', task: result.rows[0] });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};