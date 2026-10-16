const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[MongoDB] Connected: ${conn.connection.host}/${conn.connection.name}`);
    }
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
