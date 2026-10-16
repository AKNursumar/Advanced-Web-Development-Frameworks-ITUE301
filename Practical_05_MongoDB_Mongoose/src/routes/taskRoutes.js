const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateObjectId = require('../middleware/validateObjectId');
const requireJsonContent = require('../middleware/contentType');

// GET /tasks - List all tasks
router.get('/', taskController.getAllTasks);

// GET /tasks/:id - Retrieve single task by ObjectId
router.get('/:id', validateObjectId, taskController.getTaskById);

// POST /tasks - Create task in MongoDB
router.post('/', requireJsonContent, taskController.createTask);

// PUT /tasks/:id - Update task in MongoDB
router.put('/:id', validateObjectId, requireJsonContent, taskController.updateTask);

// DELETE /tasks/:id - Delete task from MongoDB
router.delete('/:id', validateObjectId, taskController.deleteTask);

module.exports = router;
