const { app } = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  Caching & Optimization API Server (Practical 9)`);
      console.log(`  Port: http://localhost:${PORT}`);
      console.log(`  Cache Engine: node-cache (TTL: 60s)`);
      console.log(`  Stats Endpoint: http://localhost:${PORT}/api/cache/stats`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Server startup failed:', err.message);
    process.exit(1);
  }
}

start();
