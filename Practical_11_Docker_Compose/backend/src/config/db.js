const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 3000) => {
  const uri = process.env.MONGO_URI || 'mongodb://mongodb:27017/awdf_tasks';

  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`[MongoDB] Connecting to ${uri} (Attempt ${i}/${retries})...`);
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`[MongoDB Connection Error] Attempt ${i} failed: ${err.message}`);
      if (i === retries) {
        console.error('[MongoDB Error] All connection retries failed. Exiting process.');
        process.exit(1);
      }
      console.log(`[MongoDB] Waiting ${delay / 1000} seconds before next retry...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

module.exports = connectDB;
