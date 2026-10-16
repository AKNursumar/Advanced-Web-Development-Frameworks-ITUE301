/**
 * Input validation middleware for auth endpoints
 */
function validateRegisterInput(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Name is required.'
    });
  }

  if (!email || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'A valid email address is required.'
    });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Password must be at least 6 characters long.'
    });
  }

  next();
}

function validateLoginInput(req, res, next) {
  const { email, password } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'A valid email address is required.'
    });
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Password is required.'
    });
  }

  next();
}

module.exports = { validateRegisterInput, validateLoginInput };
