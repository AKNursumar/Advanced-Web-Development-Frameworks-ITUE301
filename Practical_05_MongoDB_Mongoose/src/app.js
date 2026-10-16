const express = require('express');
require('dotenv').config();
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

function createApp() {
  const app = express();

  // 1. Global Request Logger
  app.use(requestLogger);

  // 2. Body Parser
  app.use(express.json());

  // 3. Root service info
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      service: 'Task Management MongoDB/Mongoose API (Practical 5)',
      author: 'Abdulkadir Nursumar',
      database: 'MongoDB with Mongoose ODM',
      endpoints: {
        tasks: '/tasks',
        taskById: '/tasks/:id'
      }
    });
  });

  // 4. Mount Task CRUD Routes
  app.use('/tasks', taskRoutes);

  // 5. 404 Handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.originalUrl}. Route not registered.`
    });
  });

  // 6. Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}

const app = createApp();

module.exports = { createApp, app };
