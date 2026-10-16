const mongoose = require('mongoose');

const requireJsonContent = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Content-Type',
        message: 'Content-Type must be application/json'
      });
    }
  }
  next();
};

const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      message: `The provided id '${id}' is not a valid MongoDB ObjectId`
    });
  }
  next();
};

module.exports = {
  requireJsonContent,
  validateTaskId
};
