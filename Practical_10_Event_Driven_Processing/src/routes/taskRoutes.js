const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const taskEvents = require('../events/taskEvents');
const { eventAuditLog } = require('../events/taskListeners');
const { requireJsonContent, validateTaskId } = require('../middleware/validate');

// GET /tasks - List all tasks
router.get('/tasks', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
});

// GET /tasks/:id - Get single task
router.get('/tasks/:id', validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with id '${req.params.id}' was not found`
      });
    }
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// POST /tasks - Create task and emit 'task-created' event asynchronously
router.post('/tasks', requireJsonContent, async (req, res, next) => {
  try {
    const { title, description, completed, priority, assignedUser } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task title is required and cannot be empty'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      completed,
      priority,
      assignedUser: assignedUser || 'AK Nursumar'
    });

    const responseTimestamp = new Date().toISOString();
    console.log(`[API] Response sent at ${responseTimestamp}`);

    // Send the HTTP response immediately to the client
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      responseSentAt: responseTimestamp,
      data: task
    });

    // Decoupled side effect: emit event asynchronously AFTER sending response
    taskEvents.emit('task-created', task);
  } catch (error) {
    next(error);
  }
});

// PUT /tasks/:id - Update task
router.put('/tasks/:id', validateTaskId, requireJsonContent, async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.title) updates.title = updates.title.trim();

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with id '${req.params.id}' was not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /tasks/:id - Delete task and emit 'task-deleted' event
router.delete('/tasks/:id', validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task Not Found',
        message: `Task with id '${req.params.id}' was not found`
      });
    }

    const responseTimestamp = new Date().toISOString();
    console.log(`[API] Delete response sent at ${responseTimestamp}`);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });

    // Emit task-deleted event for asynchronous auditing
    taskEvents.emit('task-deleted', task);
  } catch (error) {
    next(error);
  }
});

// GET /api/events/logs - Audit endpoint to inspect event execution logs
router.get('/api/events/logs', (req, res) => {
  res.status(200).json({
    success: true,
    count: eventAuditLog.length,
    logs: eventAuditLog
  });
});

// POST /api/events/trigger-error - Demonstration endpoint to verify safe error handling
router.post('/api/events/trigger-error', (req, res) => {
  const testError = new Error(req.body.message || 'Simulated listener exception');
  taskEvents.emit('error', testError);
  res.status(200).json({
    success: true,
    message: 'Error event emitted safely to taskEvents error listener without server crash'
  });
});

module.exports = router;
