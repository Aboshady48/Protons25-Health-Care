// --- REQUIRED IMPORTS ---
const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// --- AI INITIALIZATION ---
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not set in environment variables. Check .env file.");
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// --- AI ASK ROUTE ---
router.post('/ask', async (req, res) => {
    if (!ai) {
        return res.status(503).json({ error: "AI service is currently unavailable. API Key missing." });
    }
    
    const { prompt } = req.body;

    console.log("--- START AI REQUEST ---");
    console.log("Received prompt:", prompt); 
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        console.error("400 Bad Request: Prompt is empty or not a string.");
        return res.status(400).json({ error: "Prompt is required and cannot be empty." });
    }

    try {
        // 3. Call the Gemini API
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-latest', 
            contents: [{ parts: [{ text: prompt }] }],
        });

        // *** CRITICAL DEBUGGING LOG ***
        // Log the entire raw response object structure from the API
        console.log("Raw API Response:", response); 
        // *******************************

        // 4. Extract the text
        const replyText = response.text;

        // 5. Check for an empty reply
        if (!replyText || replyText.trim() === '') {
            console.warn("AI returned an empty or unreadable response.");
            return res.json({ reply: "I'm sorry, I couldn't generate a clear response for that." });
        }

        // 6. Success: Send the reply
        console.log("Successfully generated AI response.");
        res.json({ reply: replyText });

    } catch (error) {
        console.error("FATAL AI GENERATION ERROR:", error.message || error); 
        res.status(500).json({ error: "An internal server error occurred during AI generation." });
    } finally {
        console.log("--- END AI REQUEST ---");
    }
});

module.exports = router;
