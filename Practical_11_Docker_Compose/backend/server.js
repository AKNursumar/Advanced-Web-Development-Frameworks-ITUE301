require('dotenv').config();
const createApp = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const app = createApp();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Docker Container] Backend running on port ${PORT}`);
    console.log(`[Docker Container] MongoDB target: ${process.env.MONGO_URI}`);
  });
});
