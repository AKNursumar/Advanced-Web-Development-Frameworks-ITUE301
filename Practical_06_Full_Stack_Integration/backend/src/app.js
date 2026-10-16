const express = require('express');
const cors = require('cors');
require('dotenv').config();
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

function createApp() {
  const app = express();

  // 1. CORS Configuration for React Frontend
  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  // 2. Request Logger
  app.use(requestLogger);

  // 3. Body Parser
  app.use(express.json());

  // 4. Root Info
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      service: 'Full-Stack Task Management API (Practical 6)',
      author: 'Abdulkadir Nursumar',
      endpoints: { tasks: '/tasks' }
    });
  });

  // 5. Routes
  app.use('/tasks', taskRoutes);

  // 6. 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Endpoint ${req.method} ${req.originalUrl} does not exist.`
    });
  });

  // 7. Global Error Handler
  app.use(errorHandler);

  return app;
}

const app = createApp();

module.exports = { createApp, app };
