const { app } = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  Task Management REST API (Practical 4)`);
  console.log(`  Running on: http://localhost:${PORT}`);
  console.log(`  Author: Abdulkadir Nursumar`);
  console.log(`  Database: In-Memory Array (Resets on restart)`);
  console.log(`====================================================`);
});

module.exports = server;
