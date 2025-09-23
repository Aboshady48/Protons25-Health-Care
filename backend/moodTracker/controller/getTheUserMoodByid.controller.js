const pool = require("../../config/db");

const getTheUserMoodByidController = async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT *
      FROM mood_tracker
      WHERE user_id = $1
      ORDER BY recorded_at DESC
    `;
    const result = await pool.query(query, [userId]);

    // Always return 200, even if no moods
    return res.status(200).json({ moods: result.rows || [] });
  } catch (error) {
    console.error("Error in getTheUserMoodByidController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getTheUserMoodByidController };
