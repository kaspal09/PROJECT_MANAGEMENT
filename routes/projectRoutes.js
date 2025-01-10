const express = require('express');
const {
    createProject,
    getProjects,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/projects', authenticate, createProject);
router.get('/projects', getProjects);
router.put('/projects/:id', authenticate, updateProject);
router.delete('/projects/:id', authenticate, deleteProject);

module.exports = router;