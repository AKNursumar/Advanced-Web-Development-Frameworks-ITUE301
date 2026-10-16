const { app } = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  Full-Stack Task API Backend (Practical 6)`);
      console.log(`  Port: http://localhost:${PORT}`);
      console.log(`  Database: MongoDB with Mongoose`);
      console.log(`  CORS Enabled for: http://localhost:5173`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Server startup failed:', err.message);
    process.exit(1);
  }
}

start();
