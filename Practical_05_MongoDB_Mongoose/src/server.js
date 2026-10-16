const { app } = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB before accepting incoming traffic
    await connectDB();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  Task Management MongoDB API (Practical 5)`);
      console.log(`  Running on: http://localhost:${PORT}`);
      console.log(`  Author: Abdulkadir Nursumar`);
      console.log(`  Database: MongoDB via Mongoose ODM`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server due to MongoDB connection failure:', err.message);
    process.exit(1);
  }
}

startServer();
