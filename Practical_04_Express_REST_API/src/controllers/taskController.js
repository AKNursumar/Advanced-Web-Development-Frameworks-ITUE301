const { v4: uuidv4 } = require('uuid');

// In-memory task repository (resets on server restart, replaced by MongoDB in Practical 5)
let tasks = [];

// Helper for test isolation
function _resetTasks(initial = []) {
  tasks = [...initial];
}

function _getTasksRaw() {
  return tasks;
}

/**
 * GET /tasks
 * Retrieves all tasks.
 */
function getAllTasks(req, res) {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
}

/**
 * GET /tasks/:id
 * Retrieves a single task by ID.
 */
function getTaskById(req, res) {
  const task = tasks.find((t) => t.id === req.taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Task with ID '${req.taskId}' does not exist.`
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
}

/**
 * POST /tasks
 * Creates a new task.
 */
function createTask(req, res, next) {
  try {
    const { title, description = '', completed = false, priority = 'medium' } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task title is required and cannot be empty.'
      });
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: `Priority must be one of: ${validPriorities.join(', ')}`
      });
    }

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: typeof description === 'string' ? description.trim() : '',
      completed: Boolean(completed),
      priority: priority.toLowerCase(),
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /tasks/:id
 * Updates an existing task by ID.
 */
function updateTask(req, res, next) {
  try {
    const taskIndex = tasks.findIndex((t) => t.id === req.taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cannot update: Task with ID '${req.taskId}' does not exist.`
      });
    }

    const { title, description, completed, priority } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Task title cannot be empty.'
        });
      }
      tasks[taskIndex].title = title.trim();
    }

    if (description !== undefined) {
      tasks[taskIndex].description = typeof description === 'string' ? description.trim() : '';
    }

    if (completed !== undefined) {
      tasks[taskIndex].completed = Boolean(completed);
    }

    if (priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority.toLowerCase())) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: `Priority must be one of: ${validPriorities.join(', ')}`
        });
      }
      tasks[taskIndex].priority = priority.toLowerCase();
    }

    tasks[taskIndex].updatedAt = new Date().toISOString();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: tasks[taskIndex]
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /tasks/:id
 * Removes a task by ID.
 */
function deleteTask(req, res, next) {
  try {
    const taskIndex = tasks.findIndex((t) => t.id === req.taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cannot delete: Task with ID '${req.taskId}' does not exist.`
      });
    }

    const [deletedTask] = tasks.splice(taskIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask
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
  deleteTask,
  _resetTasks,
  _getTasksRaw
};
