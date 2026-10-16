const express = require('express');
const cors = require('cors');
require('dotenv').config();
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  app.use(requestLogger);
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      service: 'JWT Authentication API (Practical 7)',
      author: 'Abdulkadir Nursumar',
      endpoints: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
        tasks: '/api/tasks'
      }
    });
  });

  // Mount routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Endpoint ${req.method} ${req.originalUrl} not found.`
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}

const app = createApp();

module.exports = { createApp, app };
