const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

// Ensure listeners are registered
require('./events/taskListeners');

const createApp = () => {
  const app = express();

  // Middleware pipeline
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // Health check
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Practical 10: Event-Driven Processing API is operational',
      student: 'Abdulkadir Nursumar',
      features: [
        'Node.js EventEmitter background processing',
        'task-created async notification',
        'task-deleted async audit log',
        'Safe error event handling',
        'Non-blocking HTTP response'
      ]
    });
  });

  // Mount API routes
  app.use('/', taskRoutes);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `The endpoint '${req.originalUrl}' does not exist on this server`
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
