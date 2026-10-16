const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const { validateRegisterInput, validateLoginInput } = require('../middleware/validateAuth');
const requireJsonContent = require('../middleware/contentType');

// POST /api/auth/register
router.post('/register', requireJsonContent, validateRegisterInput, authController.register);

// POST /api/auth/login
router.post('/login', requireJsonContent, validateLoginInput, authController.login);

// GET /api/auth/me (Protected route)
router.get('/me', authenticateToken, authController.getMe);

module.exports = router;
