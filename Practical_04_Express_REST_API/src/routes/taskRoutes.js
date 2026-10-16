const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateTaskId = require('../middleware/validateTaskId');
const requireJsonContent = require('../middleware/contentType');

// GET /tasks - Retrieve all tasks
router.get('/', taskController.getAllTasks);

// GET /tasks/:id - Retrieve single task
router.get('/:id', validateTaskId, taskController.getTaskById);

// POST /tasks - Create task (enforces JSON content-type)
router.post('/', requireJsonContent, taskController.createTask);

// PUT /tasks/:id - Update task (validates ID format and JSON content-type)
router.put('/:id', validateTaskId, requireJsonContent, taskController.updateTask);

// DELETE /tasks/:id - Delete task
router.delete('/:id', validateTaskId, taskController.deleteTask);

module.exports = router;
