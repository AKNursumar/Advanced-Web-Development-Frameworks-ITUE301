const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('[Centralized Error Caught]:', err.message);
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: messages
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      message: `Resource not found with id ${err.value}`
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Server encountered an unexpected error'
  });
};

module.exports = errorHandler;
