const pool = require('../../config/db');

exports.addTask = async (req, res) => {
    const tasks = req.body; // Array of tasks
    const userId = req.user.id; // from JWT

    try {
        const values = [];
        const query = `
            INSERT INTO tasks (user_id, title, description, scheduled_time, priority, completed)
            VALUES ${tasks.map((_, i) => 
                `($${i*6+1}, $${i*6+2}, $${i*6+3}, $${i*6+4}, $${i*6+5}, $${i*6+6})`
            ).join(", ")}
            RETURNING *;
        `;

        tasks.forEach(t => {
            values.push(
                userId, 
                t.title, 
                t.description || null, 
                t.scheduled_time || null, 
                t.priority || 1,      // default priority = 1
                t.completed || false  // default completed = false
            );
        });

        const result = await pool.query(query, values);
        res.status(201).json({ 
            message: 'Tasks added successfully', 
            tasks: result.rows 
        });
    } catch (error) {
        console.error('Error adding tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
