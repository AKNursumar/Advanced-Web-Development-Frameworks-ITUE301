/**
 * Global Request Logging Middleware
 * Records HTTP method, URL, and runtime ISO timestamp.
 */
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[HTTP] ${req.method} ${req.url} - ${timestamp}`);
  next();
}

module.exports = requestLogger;
