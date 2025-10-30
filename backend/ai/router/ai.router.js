const express = require("express");
const airouter = express.Router();
const auth = require("../../middleware/auth.middleware");
const chatCtrl = require("../controller/chat.controller");


// Create a new chat
airouter.post("/chats", auth, chatCtrl.createChat);

//Add a new message inside an existing chat 
airouter.post("/chats/:chatId/messages", auth, chatCtrl.addMessage);

// Get all chats that belong to the authenticated user
airouter.get("/chats", auth, chatCtrl.getAllChats);

// Get a specific chat by its ID (including its messages)
airouter.get("/chats/:id", auth, chatCtrl.getChatById);

// Delete a chat (remove a conversation and all its messages)
airouter.delete("/chats/:id", auth, chatCtrl.deleteChat);

module.exports = airouter;
