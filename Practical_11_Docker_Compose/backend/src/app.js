const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Request logger
  app.use((req, res, next) => {
    console.log(`[Docker Backend] ${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
  });

  // Health check endpoint for Docker Compose healthcheck
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'UP',
      service: 'practical-11-backend',
      timestamp: new Date().toISOString()
    });
  });

  // Mount API
  app.use('/', taskRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: `Path '${req.originalUrl}' not found` });
  });

  // Global error handler
  app.use((err, req, res, next) => {
    console.error('[Backend Error]:', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  return app;
};

module.exports = createApp;
