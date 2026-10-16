function requestLogger(req, res, next) {
  console.log(`[HTTP] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
}

module.exports = requestLogger;
