const mongoose = require('mongoose');

async function connectDB(customUri) {
  const uri = customUri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_tasks_practical9';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected: ${conn.connection.name} @ ${conn.connection.host}:${conn.connection.port}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB Connection Error]: ${err.message}`);
    throw err;
  }
}

async function disconnectDB() {
  try {
    await mongoose.connection.close();
  } catch (err) {
    console.error('[MongoDB Disconnect Error]:', err.message);
  }
}

module.exports = { connectDB, disconnectDB };
