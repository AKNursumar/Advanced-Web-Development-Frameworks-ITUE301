const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Practical 12: CI/CD Pipeline API is live',
      student: 'Abdulkadir Nursumar',
      pipeline: 'GitHub Actions (Build, Lint, Automated Tests)'
    });
  });

  app.use('/', taskRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `The endpoint '${req.originalUrl}' does not exist on this server`
    });
  });

  app.use(errorHandler);

  return app;
};

module.exports = createApp;
