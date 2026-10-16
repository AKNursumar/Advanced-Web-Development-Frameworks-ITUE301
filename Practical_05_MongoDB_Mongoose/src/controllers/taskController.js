const Task = require('../models/Task');

/**
 * GET /tasks
 * Retrieves all tasks from MongoDB.
 */
async function getAllTasks(req, res, next) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /tasks/:id
 * Retrieves a single task by its MongoDB ObjectId.
 */
async function getTaskById(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Task with ID '${req.params.id}' was not found in the database.`
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

/**
 * POST /tasks
 * Creates and persists a new task document in MongoDB.
 */
async function createTask(req, res, next) {
  try {
    const { title, description, completed, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      completed,
      priority
    });

    res.status(201).json({
      success: true,
      message: 'Task created and persisted in MongoDB',
      data: task
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /tasks/:id
 * Updates an existing task document in MongoDB.
 */
async function updateTask(req, res, next) {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return updated document
        runValidators: true // Enforce schema validations on update
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cannot update: Task with ID '${req.params.id}' was not found.`
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

/**
 * DELETE /tasks/:id
 * Deletes a task document from MongoDB.
 */
async function deleteTask(req, res, next) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cannot delete: Task with ID '${req.params.id}' was not found.`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully from MongoDB',
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
