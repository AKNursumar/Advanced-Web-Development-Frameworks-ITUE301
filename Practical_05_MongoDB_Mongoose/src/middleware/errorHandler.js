/**
 * Global Centralized Error Handler
 * Translates Mongoose ValidationError and CastError into clean, structured JSON responses.
 */
function errorHandler(err, req, res, next) {
  console.error('[Error Pipeline]:', err.message || err);

  // Mongoose Validation Error (Schema rule violations)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      messages: messages,
      message: messages.join('. ')
    });
  }

  // Mongoose Cast Error (Invalid ObjectId cast)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Cast Error',
      message: `Resource not found with invalid id format: ${err.value}`
    });
  }

  // Duplicate Key Error (MongoDB code 11000)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: 'Duplicate Key Error',
      message: 'A resource with this key already exists.'
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.'
  });
}

module.exports = errorHandler;
