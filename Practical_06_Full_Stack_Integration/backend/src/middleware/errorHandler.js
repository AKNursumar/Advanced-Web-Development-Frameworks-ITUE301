function errorHandler(err, req, res, next) {
  console.error('[Backend Error]:', err.message || err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: messages.join('. ')
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Cast Error',
      message: `Invalid ID format: ${err.value}`
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
