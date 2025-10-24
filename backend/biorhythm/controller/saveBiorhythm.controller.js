const pool = require('../../config/db');

// Save Biorhythm Result
exports.addBiorhythm = async (req, res) => {
  const user = req.user; // from JWT
  const { chronotype, scores } = req.body;

  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  if (!chronotype || !scores) {
    return res.status(400).json({ error: 'Chronotype and scores are required' });
  }

  try {
    const query = `
      INSERT INTO biorhythm (user_id, chronotype, scores)
      VALUES ($1, $2, $3::jsonb)
      RETURNING *;
    `;
    const values = [user.id, chronotype, JSON.stringify(scores)];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Biorhythm result saved successfully',
      biorhythm: result.rows[0],
    });
  } catch (error) {
    console.error('Error saving biorhythm:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

// Get all biorhythm results for logged-in user
exports.getBiorhythms = async (req, res) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(
      'SELECT * FROM biorhythm WHERE user_id=$1 ORDER BY assessed_at DESC',
      [user.id]
    );
    res.status(200).json({ success: true, results: result.rows });
  } catch (error) {
    console.error('Error fetching biorhythm results:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
