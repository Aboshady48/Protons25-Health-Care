const express = require('express');
const authRouter = express.Router();
const { registerController } = require('../controller/register.controller');
const { loginController } = require('../controller/login.controller');
const { getAllUsersController } = require('../controller/getAllUsers.controller');
const { getUserByIdController } = require('../controller/getUserById.controller');
const { getUserProfile } = require("../controller/getUserProfile.controller");
const authMiddleware = require('../../middleware/auth.middleware');

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/users', getAllUsersController);
authRouter.get('/users/:id', getUserByIdController);
authRouter.get("/profile", authMiddleware , getUserProfile);

module.exports = authRouter;
