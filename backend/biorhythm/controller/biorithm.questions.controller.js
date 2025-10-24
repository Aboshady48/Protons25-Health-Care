const pool = require("../../config/db");

// Add Biorhythm questions (with points)
exports.addBiorhythmQuestions = async (req, res) => {
  const { questions } = req.body;

  if (!Array.isArray(questions) || !questions.length)
    return res.status(400).json({ error: "Questions array is required." });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    for (const q of questions) {
      const { text, options } = q;
      const qRes = await client.query(
        "INSERT INTO biorhythm_questions (text) VALUES ($1) RETURNING id",
        [text]
      );
      const questionId = qRes.rows[0].id;

      for (const opt of options) {
        await client.query(
          "INSERT INTO biorhythm_options (question_id, text, points) VALUES ($1, $2, $3)",
          [questionId, opt.text, JSON.stringify(opt.points)]
        );
      }
    }
    await client.query("COMMIT");
    res.status(201).json({ message: "Biorhythm questions added." });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    client.release();
  }
};

// Get all Biorhythm questions with options
exports.getBiorhythmQuestions = async (req, res) => {
  try {
    const query = `
      SELECT 
        q.id AS question_id,
        q.text AS question_text,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', o.id,
              'text', o.text,
              'points', o.points
            )
          ) FILTER (WHERE o.id IS NOT NULL), '[]'
        ) AS options
      FROM biorhythm_questions q
      LEFT JOIN biorhythm_options o ON q.id = o.question_id
      GROUP BY q.id
      ORDER BY q.id ASC;
    `;
    
    const result = await pool.query(query);
    res.status(200).json({ success: true, questions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


/**
 * 
CREATE TABLE biorhythm_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    answers JSONB,          -- {"q1": "optionId", ...}
    scores JSONB,           -- {"Morning": 12, "Balanced": 8, ...}
    top_profile VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
 */
exports.saveBiorhythmResult = async (req, res) => {
  const user = req.user; // from JWT
  const { answers, scores, top_profile } = req.body;

  if (!user) return res.status(401).json({ error: "Unauthorized" });
  if (!answers || !scores || !top_profile)
    return res.status(400).json({ error: "Answers, scores, and top_profile are required." });

  try {
    const query = `
      INSERT INTO biorhythm_results (user_id, answers, scores, top_profile)
      VALUES ($1, $2::jsonb, $3::jsonb, $4)
      RETURNING *;
    `;
    const values = [user.id, JSON.stringify(answers), JSON.stringify(scores), top_profile];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Biorhythm result saved successfully",
      biorhythm_result: result.rows[0],
    });
  } catch (error) {
    console.error("Error saving biorhythm result:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}