const mongoose = require('mongoose');

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
