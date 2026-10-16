const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/awdf_tasks_practical13';
    const conn = await mongoose.connect(uri);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    }
    return conn;
  } catch (err) {
    console.error(`[MongoDB Error] ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
