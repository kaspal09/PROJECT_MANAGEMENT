const express = require('express');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Task routes
router.post('/projects/:projectId/tasks', authenticate, createTask);
router.get('/projects/:projectId/tasks', authenticate, getTasks);
router.put('/projects/:projectId/tasks/:taskId', authenticate, updateTask);
router.delete('/projects/:projectId/tasks/:taskId', authenticate, deleteTask);

module.exports = router;
