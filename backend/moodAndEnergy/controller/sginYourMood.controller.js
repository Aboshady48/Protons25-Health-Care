const pool = require('../../config/db');

const sginYourMoodController = async (req,res)=>{

    const {mood,energy} = req.body;
    const {id} = req.user;

    try {
        const query = 'INSERT INTO mood_energy (user_id,mood,energy) VALUES ($1,$2,$3) RETURNING *';
        const result = await pool.query(query,[id,mood,energy]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error in sginYourMoodController', error);
        res.status(500).json({ message: 'Internal server error' });
    }

}

module.exports = {sginYourMoodController};