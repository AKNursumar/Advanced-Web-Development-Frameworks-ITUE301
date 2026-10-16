require('dotenv').config();
const createApp = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[CI/CD API] Practical 12 running on http://localhost:${PORT}`);
    console.log(`[CI/CD API] Ready for GitHub Actions deployment.`);
  });
});
