const mongoose = require('mongoose');

/**
 * Route-specific middleware validating MongoDB ObjectId format.
 * Returns HTTP 400 if ID is not a valid 24-character hexadecimal ObjectId string.
 */
function validateObjectId(req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID Format',
      message: `The provided ID '${id}' is not a valid 24-hex-character MongoDB ObjectId.`
    });
  }

  next();
}

module.exports = validateObjectId;
