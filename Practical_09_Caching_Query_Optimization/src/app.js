const express = require('express');
require('dotenv').config();
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const cacheRoutes = require('./routes/cacheRoutes');

function createApp() {
  const app = express();

  app.use(requestLogger);
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      service: 'Caching & Query Optimization API (Practical 9)',
      author: 'Abdulkadir Nursumar',
      cachingLibrary: 'node-cache',
      endpoints: {
        tasks: '/tasks',
        cacheStats: '/api/cache/stats',
        cacheFlush: 'POST /api/cache/flush'
      }
    });
  });

  app.use('/tasks', taskRoutes);
  app.use('/api/cache', cacheRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Endpoint ${req.method} ${req.originalUrl} not found.`
    });
  });

  app.use(errorHandler);

  return app;
}

const app = createApp();

module.exports = { createApp, app };
