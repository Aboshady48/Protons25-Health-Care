const pool = require('../../config/db');

/**
 * DATABASE STRUCTURE:
 * 
 * CREATE TABLE questions (
 *   id SERIAL PRIMARY KEY,
 *   text TEXT NOT NULL,
 *   type VARCHAR(50) DEFAULT 'default'
 * );
 *
 * CREATE TABLE question_options (
 *   id SERIAL PRIMARY KEY,
 *   question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
 *   label VARCHAR(255) NOT NULL,
 *   value INTEGER NOT NULL
 * );
 *
 * CREATE TABLE chooses (
 *   id SERIAL PRIMARY KEY,
 *   user_id INTEGER REFERENCES users(id),
 *   choice VARCHAR(255) NOT NULL,
 *   description TEXT,
 *   score INTEGER NOT NULL
 * );
 */

exports.addQuestions = async (req, res) => {
  let { questions } = req.body;
  const user = req.user; // From JWT middleware

  // ✅ Handle if body is an array directly
  if (Array.isArray(req.body) && !questions) {
    questions = req.body;
  }

  // ✅ Make sure user is authenticated
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  // ✅ Validate input structure
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'Questions must be a non-empty array.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start transaction
    const insertedQuestions = [];

    for (const q of questions) {
      const { text, type, options } = q;

      // ✅ Validate question
      if (!text || typeof text !== 'string' || text.trim() === '') {
        throw new Error('Each question must have a non-empty text string.');
      }
      if (type && typeof type !== 'string') {
        throw new Error('Question type must be a string.');
      }

      // ✅ Insert question
      const questionQuery = `
        INSERT INTO questions (text, type)
        VALUES ($1, $2)
        RETURNING id, text, type;
      `;
      const questionValues = [text.trim(), type || 'default'];
      const questionResult = await client.query(questionQuery, questionValues);
      const questionId = questionResult.rows[0]?.id;

      if (!questionId) {
        throw new Error('Failed to insert question — no ID returned.');
      }

      console.log(`✅ Inserted question ID: ${questionId} (${text})`);

      // ✅ Insert options (if provided)
      if (options && Array.isArray(options) && options.length > 0) {
        for (const option of options) {
          if (!option.label || typeof option.label !== 'string' || option.label.trim() === '') {
            throw new Error('Each option must have a non-empty string label.');
          }
          if (option.value === undefined || typeof option.value !== 'number') {
            throw new Error('Each option must have a numeric value.');
          }

          const optionQuery = `
            INSERT INTO question_options (question_id, label, value)
            VALUES ($1, $2, $3);
          `;
          const optionValues = [questionId, option.label.trim(), option.value];
          await client.query(optionQuery, optionValues);
        }
      }

      insertedQuestions.push(questionResult.rows[0]);
    }

    await client.query('COMMIT'); // ✅ Commit transaction

    res.status(201).json({
      message: 'Questions and options added successfully',
      count: insertedQuestions.length,
      questions: insertedQuestions,
    });

  } catch (error) {
    await client.query('ROLLBACK'); // ❌ Rollback on any error
    console.error('❌ Error adding questions:', error.message);
    res.status(500).json({ error: error.message || 'Internal server error' });
  } finally {
    client.release();
  }
};

