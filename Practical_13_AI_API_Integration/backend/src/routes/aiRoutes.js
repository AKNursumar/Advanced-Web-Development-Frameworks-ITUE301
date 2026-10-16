const express = require('express');
const router = express.Router();
const { generateTaskDescription } = require('../services/aiService');
const aiRateLimiter = require('../middleware/rateLimiter');
const { requireJsonContent } = require('../middleware/validate');

// GET /api/ai/status - Safe status inspection (never exposes secrets)
router.get('/status', (req, res) => {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const apiKey = provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey.trim().length > 0 && !apiKey.includes('your_'));

  res.status(200).json({
    success: true,
    provider,
    isKeyConfigured,
    rateLimitPerMinute: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || '5', 10),
    privacyPolicy: 'Only task title is sent to AI API; no private user credentials, tokens, or personal records are ever transmitted.'
  });
});

// POST /api/ai/generate-description - Auto-generate description from task title
router.post('/generate-description', requireJsonContent, aiRateLimiter, async (req, res, next) => {
  try {
    const { title } = req.body;

    // Validate title input
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task title is required and must be at least 3 characters long for AI generation'
      });
    }

    if (title.length > 150) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Task title exceeds maximum allowed length of 150 characters'
      });
    }

    // Call AI Service (handles timeouts and graceful fallback)
    const result = await generateTaskDescription(title.trim());

    // Always returns 200 with structured response even if fallback is triggered
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
