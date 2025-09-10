const express = require('express');
const taskRouter = express.Router();
const { addTask } = require('../controller/AddTasks.controller');
const { getAllTasks } = require('../controller/GetAllTasks.controller');
const { gitTaskById } = require('../controller/GitTaskById.controller');
const {editTask} = require('../controller/EditTask.controller');
const { deleteTask } = require('../controller/DeleteTask.controller');
const authMiddleware = require('../../middleware/auth.middleware');

taskRouter.post('/add', authMiddleware, addTask);
taskRouter.get('/all', authMiddleware, getAllTasks);
taskRouter.get('/:id', authMiddleware, gitTaskById);
taskRouter.delete('/:id', authMiddleware, deleteTask);
taskRouter.put('/:id', authMiddleware, editTask);

module.exports = taskRouter;