require('dotenv').config();
const createApp = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`[Server] Practical 10 running on http://localhost:${PORT}`);
    console.log(`[Server] EventEmitter background processing active.`);
    console.log(`[Server] Notification delay: ${process.env.NOTIFICATION_DELAY_MS || 1500}ms`);
  });
});
