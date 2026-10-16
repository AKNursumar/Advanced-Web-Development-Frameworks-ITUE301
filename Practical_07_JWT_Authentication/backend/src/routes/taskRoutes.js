const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middleware/authMiddleware');
const validateObjectId = require('../middleware/validateObjectId');
const requireJsonContent = require('../middleware/contentType');

// Apply auth middleware to protect all task routes
router.use(authenticateToken);

// GET /api/tasks - Retrieve user's tasks
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id - Retrieve user's single task
router.get('/:id', validateObjectId, taskController.getTaskById);

// POST /api/tasks - Create user task
router.post('/', requireJsonContent, taskController.createTask);

// PUT /api/tasks/:id - Update user task
router.put('/:id', validateObjectId, requireJsonContent, taskController.updateTask);

// DELETE /api/tasks/:id - Delete user task
router.delete('/:id', validateObjectId, taskController.deleteTask);

module.exports = router;
