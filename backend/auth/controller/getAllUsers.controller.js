const pool = require('../../config/db');

const getAllUsersController = async (req, res) => {
    try {
        const query = 'SELECT id, username, email FROM users';
        const result = await pool.query(query);
        const users = result.rows;
        res.json(users);
        
    } catch (error) {
        console.error('Error in getAllUsersController', error);
    }
}
module.exports = { getAllUsersController };