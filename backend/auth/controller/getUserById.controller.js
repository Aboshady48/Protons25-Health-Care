const pool = require('../../config/db');

const getUserByIdController = async (req, res) => {
    const userId = req.params.id;
    try {
        const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        return res.status(200).json(user);
        
    } catch (error) {
        console.error('Error in getUserByIdController', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
module.exports = { getUserByIdController };
