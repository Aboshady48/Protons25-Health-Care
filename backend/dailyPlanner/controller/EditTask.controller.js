const pool = require('../../config/db');

exports.editTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, scheduled_time, priority, completed } = req.body;
    const userId = req.user.id;

    try {
        const existing = await pool.query(
            'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (existing.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found or unauthorized' });
        }

        const oldTask = existing.rows[0];

        const result = await pool.query(
            `UPDATE tasks 
             SET title = $1, description = $2, scheduled_time = $3, priority = $4, completed = $5
             WHERE id = $6 AND user_id = $7
             RETURNING *`,
            [
                title ?? oldTask.title,
                description ?? oldTask.description,
                scheduled_time ?? oldTask.scheduled_time,
                priority ?? oldTask.priority,
                completed ?? oldTask.completed,
                id,
                userId
            ]
        );

        res.status(200).json({ 
            message: 'Task updated successfully', 
            task: result.rows[0] 
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
