/**
 * In-memory sliding window rate limiter for AI generation endpoint
 */
const requestHistory = new Map();

const aiRateLimiter = (req, res, next) => {
  const limit = parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || '5', 10);
  const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window

  if (!requestHistory.has(clientIp)) {
    requestHistory.set(clientIp, []);
  }

  const timestamps = requestHistory.get(clientIp);

  // Filter timestamps within the current sliding window
  const recentRequests = timestamps.filter((time) => now - time < windowMs);

  if (recentRequests.length >= limit) {
    const oldest = recentRequests[0];
    const retryAfterSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
    return res.status(429).json({
      success: false,
      error: 'Too Many Requests',
      message: `AI generation rate limit exceeded (maximum ${limit} requests per minute). Please try again in ${retryAfterSeconds} seconds.`,
      retryAfterSeconds
    });
  }

  recentRequests.push(now);
  requestHistory.set(clientIp, recentRequests);
  next();
};

module.exports = aiRateLimiter;
