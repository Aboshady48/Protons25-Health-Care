const pool = require("../../config/db");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;

/**Call Gemini API with retry mechanism */
const callGeminiAPI = async (prompt, model_name = "gemini-2.5-flash", retries = 3) => {
  const url = `https://generativelanguage.googleapis.com/v1/models/${model_name}:generateContent?key=${apiKey}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await res.json();
    if (res.ok) return data;
    if (res.status === 503 && attempt < retries) {
      console.warn(`Gemini overloaded. Retrying (${attempt}/${retries})`);
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }
    throw new Error(data.error?.message || "Gemini API failed");
  }
};

/** Create a new chat */
exports.createChat = async (req, res) => {
  const userId = req.user.id;
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    // Call Gemini API
    const data = await callGeminiAPI(prompt);
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

    // Create a new chat record
    const chatRes = await pool.query(
      `INSERT INTO chats (user_id, title, model_name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, prompt.slice(0, 40), "gemini-2.5-flash"]
    );
    const chat = chatRes.rows[0];

    // Add the first two messages (user + AI)
    await pool.query(
      `INSERT INTO messages (chat_id, sender, content)
       VALUES ($1, 'user', $2), ($1, 'ai', $3)`,
      [chat.id, prompt, reply]
    );

    res.status(201).json({
      message: "Chat created successfully",
      chat: {
        ...chat,
        messages: [
          { sender: "user", content: prompt },
          { sender: "ai", content: reply },
        ],
      },
    });
  } catch (error) {
    console.error("Error creating chat:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

/** Send a new message inside an existing chat */
exports.addMessage = async (req, res) => {
  const userId = req.user.id;
  const { chatId } = req.params;
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    // Verify that the chat belongs to the user
    const chatCheck = await pool.query(
      `SELECT * FROM chats WHERE id = $1 AND user_id = $2`,
      [chatId, userId]
    );
    if (chatCheck.rows.length === 0)
      return res.status(404).json({ error: "Chat not found" });

    // Call Gemini API for a new response
    const data = await callGeminiAPI(prompt);
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

    // Insert both user and AI messages
    await pool.query(
      `INSERT INTO messages (chat_id, sender, content)
       VALUES ($1, 'user', $2), ($1, 'ai', $3)`,
      [chatId, prompt, reply]
    );

    res.status(200).json({
      message: "Message added successfully",
      newMessages: [
        { sender: "user", content: prompt },
        { sender: "ai", content: reply },
      ],
    });
  } catch (error) {
    console.error("Error adding message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** 🟣 Get all chats for the logged-in user */
exports.getAllChats = async (req, res) => {
  const userId = req.user.id;
  try {
    const chats = await pool.query(
      `SELECT id, title, model_name, created_at
       FROM chats WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    res.status(200).json({ chats: chats.rows });
  } catch (error) {
    console.error("Error fetching chats:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** Get a specific chat with all its messages */
exports.getChatById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const chatRes = await pool.query(
      `SELECT * FROM chats WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    if (chatRes.rows.length === 0)
      return res.status(404).json({ error: "Chat not found" });

    const messagesRes = await pool.query(
      `SELECT sender, content, created_at
       FROM messages WHERE chat_id = $1
       ORDER BY created_at ASC`,
      [id]
    );

    res.status(200).json({
      chat: {
        ...chatRes.rows[0],
        messages: messagesRes.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching chat:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** 🔴 Delete a chat and all its messages */
exports.deleteChat = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  try {
    const del = await pool.query(
      `DELETE FROM chats WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    if (del.rows.length === 0)
      return res.status(404).json({ error: "Chat not found" });

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
