function requireJsonContent(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.toLowerCase().includes('application/json')) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: "Requests with payload (POST/PUT) must specify 'Content-Type: application/json'"
      });
    }
  }
  next();
}

module.exports = requireJsonContent;
