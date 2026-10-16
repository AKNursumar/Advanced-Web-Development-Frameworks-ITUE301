const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB via Mongoose.
 * Fails fast and visibly if MongoDB is unreachable; does NOT silently fall back to in-memory.
 */
async function connectDB(customUri) {
  const uri = customUri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_tasks_practical5';

  if (!uri) {
    throw new Error('Database connection failed: MONGO_URI environment variable is missing.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5-second connection timeout
    });
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} @ ${conn.connection.host}:${conn.connection.port}`);
    return conn;
  } catch (err) {
    console.error(`[MongoDB Connection Error]: ${err.message}`);
    throw err;
  }
}

async function disconnectDB() {
  try {
    await mongoose.connection.close();
    console.log('[MongoDB] Connection closed successfully.');
  } catch (err) {
    console.error('[MongoDB Disconnect Error]:', err.message);
  }
}

module.exports = { connectDB, disconnectDB };
