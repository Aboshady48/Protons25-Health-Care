const pool = require('../../config/db');

const getTheUserMoodByidController = async (req, res) => {
        const { id } = req.params;
        try {
            const query = 'SELECT * FROM mood_energy WHERE user_id = $1';
            const result = await pool.query(query, [id]);
            const userMood = result.rows[0];
            res.json(userMood);
        } catch (error) {
            console.error('Error in getTheUserMoodByidController', error);
            res.status(500).json({ message: 'Internal server error' });
        }
};

module.exports = {getTheUserMoodByidController}