const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[CI/CD API] ${req.method} ${req.url} - ${timestamp}`);
  next();
};

module.exports = requestLogger;
