const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[HTTP Request] ${req.method} ${req.url} - ${timestamp}`);
  next();
};

module.exports = requestLogger;
