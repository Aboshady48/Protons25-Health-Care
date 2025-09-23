const pool = require('../../config/db');

const getAllUsersController = async (req, res) => {
    try {
        const query = 'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC';
        const result = await pool.query(query);
        const users = result.rows;
        res.json(users);
        
    } catch (error) {
        console.error('Error in getAllUsersController', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = { getAllUsersController };
