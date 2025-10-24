const pool = require('../../config/db');
/**
 * CREATE TABLE biorhythm_profiles (
    id SERIAL PRIMARY KEY,
    profile_key VARCHAR(50) UNIQUE NOT NULL, -- 'Morning', 'Evening', etc.
    profile_name VARCHAR(255) NOT NULL,
    description TEXT,
    best_focus TEXT,
    best_exercise_time TEXT,
    meal_rhythm TEXT,
    tip TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

 */
// Add predefined biorhythm profiles
exports.getProfiles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM biorhythm_profiles ORDER BY id ASC');
        res.status(200).json({ success: true, profiles: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}