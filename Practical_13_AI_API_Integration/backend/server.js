require('dotenv').config();
const createApp = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[Server] Practical 13 Backend running on http://localhost:${PORT}`);
    console.log(`[AI Configuration] Active provider: ${process.env.AI_PROVIDER || 'gemini'}`);
    const key = process.env.AI_PROVIDER === 'openai' ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY;
    const isConfigured = Boolean(key && key.trim().length > 0 && !key.includes('your_'));
    console.log(`[AI Configuration] API Key configured: ${isConfigured ? 'YES (Live AI active)' : 'NO (Graceful fallback mode active)'}`);
  });
});
