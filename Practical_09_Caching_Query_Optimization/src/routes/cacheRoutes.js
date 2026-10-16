const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /api/cache/stats - Exposes cache hits, misses, and active keys
router.get('/stats', taskController.getCacheStats);

// POST /api/cache/flush - Clears cache
router.post('/flush', taskController.flushCache);

module.exports = router;
