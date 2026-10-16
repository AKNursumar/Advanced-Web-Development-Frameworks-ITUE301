const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[AI App] ${req.method} ${req.url} - ${timestamp}`);
  next();
};

module.exports = requestLogger;
