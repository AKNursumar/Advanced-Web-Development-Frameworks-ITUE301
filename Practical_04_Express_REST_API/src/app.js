const express = require('express');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

function createApp() {
  const app = express();

  // 1. Global Request Logger Middleware
  app.use(requestLogger);

  // 2. Body Parser Middleware
  app.use(express.json());

  // 3. Health check root endpoint
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      service: 'Task Management REST API (Practical 4)',
      version: '1.0.0',
      author: 'Abdulkadir Nursumar',
      endpoints: {
        tasks: '/tasks',
        taskById: '/tasks/:id'
      }
    });
  });

  // 4. Mount task CRUD routes
  app.use('/tasks', taskRoutes);

  // 5. 404 Handler for undefined routes (Supplementary Requirement)
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.originalUrl}. Route not registered.`
    });
  });

  // 6. Centralized Error Handling Middleware (must be last)
  app.use(errorHandler);

  return app;
}

const app = createApp();

module.exports = { createApp, app };
