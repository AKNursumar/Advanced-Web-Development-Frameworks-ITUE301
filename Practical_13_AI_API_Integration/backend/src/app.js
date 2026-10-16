const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // Health / Welcome endpoint
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Practical 13: Full-Stack Task Manager with AI Integration is live',
      student: 'Abdulkadir Nursumar',
      features: [
        'AI Task Description Auto-Generation (POST /api/ai/generate-description)',
        'Support for Google Gemini and OpenAI models',
        'Strict server-side API key isolation',
        'Rate limiting & privacy protection',
        'Graceful failure handling with fallback',
        'Persistent MongoDB CRUD operations'
      ]
    });
  });

  // Mount API routers
  app.use('/api/ai', aiRoutes);
  app.use('/', taskRoutes);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Endpoint '${req.originalUrl}' does not exist on this server`
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
