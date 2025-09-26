const pool = require("../../config/db");

const getAllMoods = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    const result = await pool.query(
      "SELECT * FROM mood_tracker ORDER BY recorded_at DESC"
    );
    res.status(200).json({ moods: result.rows });
  } catch (error) {
    console.error("Error fetching moods:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getAllMoods };
