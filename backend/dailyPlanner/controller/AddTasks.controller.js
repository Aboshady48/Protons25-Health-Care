const pool = require('../../config/db');


exports.addTask = async (req, res) => {
    const tasks = req.body; // Array of tasks
    try {
        const values = [];
        const query = `
            INSERT INTO tasks (user_id, title, description, scheduled_time)
            VALUES ${tasks.map((_, i) => `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`).join(", ")}
            RETURNING *;
        `;
        
        tasks.forEach(t => {
            values.push(t.user_id, t.title, t.description, t.scheduled_time);
        });

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Tasks added successfully', tasks: result.rows });
    } catch (error) {
        console.error('Error adding tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
