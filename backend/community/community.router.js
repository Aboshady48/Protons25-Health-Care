const express = require("express");
const communityRouter = express.Router();
const { postMessage } = require("./controller/postMassge.controller");
const { getAllCommunity } = require("./controller/getAllCommunity.controller");
const authMiddleware  = require("../middleware/auth.middleware");
// Route to post a new community feedback message
communityRouter.post("/feedback",authMiddleware, postMessage);

// Route to get all community feedback messages
communityRouter.get("/feedback", authMiddleware , getAllCommunity);

module.exports = communityRouter;
