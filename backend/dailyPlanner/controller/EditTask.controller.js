const pool = require('../../config/db');

exports.editTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, scheduled_time } = req.body;

    try {
        
        const existing = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (existing.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        const oldTask = existing.rows[0];


        const updatedTitle = title ?? oldTask.title;
        const updatedDescription = description ?? oldTask.description;
        const updatedTime = scheduled_time ?? oldTask.scheduled_time;

        const result = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, scheduled_time = $3 WHERE id = $4 RETURNING *',
            [updatedTitle, updatedDescription, updatedTime, id]
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
