const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateObjectId = require('../middleware/validateObjectId');
const requireJsonContent = require('../middleware/contentType');

router.get('/', taskController.getAllTasks);
router.get('/:id', validateObjectId, taskController.getTaskById);
router.post('/', requireJsonContent, taskController.createTask);
router.put('/:id', validateObjectId, requireJsonContent, taskController.updateTask);
router.delete('/:id', validateObjectId, taskController.deleteTask);

module.exports = router;
