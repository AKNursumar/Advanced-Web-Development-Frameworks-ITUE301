const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Validates JSON Web Token from the Authorization header (Bearer <token>).
 * Safely handles missing, malformed, expired, or invalid signatures with HTTP 401.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Access denied. Missing Authorization header.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: "Malformed authorization format. Required: 'Bearer <token>'"
    });
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      success: false,
      error: 'Configuration Error',
      message: 'Server error: JWT_SECRET environment variable is missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id: user._id, email: user.email, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token Expired',
        message: 'Your authentication token has expired. Please log in again.'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid Token',
      message: 'Authentication failed. Invalid or tampered token.'
    });
  }
}

module.exports = authenticateToken;
