const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');

// GET /tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /tasks/:id
router.get('/tasks/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /tasks
router.post('/tasks', async (req, res) => {
  try {
    const { title, description, completed, priority } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const task = await Task.create({
      title: title.trim(),
      description,
      completed,
      priority
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /tasks/:id
router.put('/tasks/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /tasks/:id
router.delete('/tasks/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully', task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
