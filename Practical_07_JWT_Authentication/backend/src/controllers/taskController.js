const Task = require('../models/Task');

/**
 * All Task CRUD operations are isolated strictly to the authenticated user (req.user.id).
 */

async function getAllTasks(req, res, next) {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Task not found or access denied.'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Cannot update: Task not found or not owned by you.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Cannot delete: Task not found or not owned by you.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
