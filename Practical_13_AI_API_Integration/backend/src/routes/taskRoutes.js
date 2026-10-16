const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { requireJsonContent, validateTaskId } = require('../middleware/validate');

// GET /tasks
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

// GET /tasks/:id
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

// POST /tasks
router.post('/tasks', requireJsonContent, async (req, res, next) => {
  try {
    const { title, description, completed, priority, isAiGenerated } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task title is required'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      completed,
      priority,
      isAiGenerated: Boolean(isAiGenerated)
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
});

// PUT /tasks/:id
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

// DELETE /tasks/:id
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

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
