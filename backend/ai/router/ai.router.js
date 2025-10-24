const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const router = express.Router();
const apiKey = process.env.GEMINI_API_KEY;

router.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "No prompt provided" });
  }

  try {
    console.log("🧠 Received Prompt:", prompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("🔥 API Error:", data);
      throw new Error(data.error?.message || "Unknown error from Google API");
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated";

    console.log("✨ AI Response:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("🔥 AI Generation Error (Full Details):", err);
    res.status(500).json({
      error: "An internal server error occurred during AI generation.",
      details: err.message,
    });
  }
});

module.exports = router;
