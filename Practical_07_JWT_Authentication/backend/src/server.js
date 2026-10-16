const { app } = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  JWT Authentication Server (Practical 7)`);
      console.log(`  Port: http://localhost:${PORT}`);
      console.log(`  Auth Routes: http://localhost:${PORT}/api/auth`);
      console.log(`  Protected Tasks: http://localhost:${PORT}/api/tasks`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Server startup failed:', err.message);
    process.exit(1);
  }
}

start();
