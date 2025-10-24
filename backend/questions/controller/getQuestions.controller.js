const pool = require('../../config/db');

// Get all questions with their options
exports.getQuestions = async (req, res) => {
  try {
    const query = `
      SELECT 
        q.id AS question_id,
        q.text AS question_text,
        q.type AS question_type,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', o.id,
              'label', o.label,
              'value', o.value
            )
          ) FILTER (WHERE o.id IS NOT NULL), '[]'
        ) AS options
      FROM questions q
      LEFT JOIN question_options o ON q.id = o.question_id
      GROUP BY q.id
      ORDER BY q.id ASC;
    `;

    const result = await pool.query(query);
    res.status(200).json({
      success: true,
      count: result.rows.length,
      questions: result.rows
    });
  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
