const pool = require("../../config/db");


const getTheUserMoodByidController = async (req, res) => {
  const userId = req.user.id; // from JWT
  const moodId = req.params.id;
  
  try {
    const query = `
            SELECT * FROM mood_tracker
            WHERE id = $1 AND user_id = $2
        `;
    const values = [moodId, userId];

    const result = await pool.query(query, values);
    res.status(200).json({ 
        message: 'Mood retrieved successfully', 
        mood: result.rows[0] 
    });
  } catch (error) {
    console.error('Error retrieving mood:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getTheUserMoodByidController };
