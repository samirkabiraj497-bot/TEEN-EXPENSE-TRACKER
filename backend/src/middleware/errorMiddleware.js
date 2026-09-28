const config = require('../config/env');

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
};

const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal server error occurred. Please try again later.'
  };

  if (config.nodeEnv === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler
};
