/**
 * Centralized Global Error Handler Middleware
 * Intercepts uncaught errors, prevents server crashes, and prevents stack trace leakage.
 */
function errorHandler(err, req, res, next) {
  // Log error internally for developer inspection
  console.error('[Error caught by global handler]:', err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected server error occurred.'
  });
}

module.exports = errorHandler;
