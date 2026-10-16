/**
 * Task ID Validation Middleware
 * Validates task ID format before passing request to the controller.
 */
function validateTaskId(req, res, next) {
  const { id } = req.params;

  // Task ID must be a non-empty alphanumeric string or positive numeric string
  if (!id || id.trim() === '' || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID Format',
      message: `The provided task ID '${id}' is not in a valid format.`
    });
  }

  req.taskId = id.trim();
  next();
}

module.exports = validateTaskId;
