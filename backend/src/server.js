const app = require('./app');
const config = require('./config/env');
const { isConfigured } = require('./config/supabase');

const PORT = config.port || 5000;

const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 TeenSpend Backend Server running on port ${PORT}`);
  console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Database Mode: ${isConfigured ? 'Live Supabase Cloud ☁️' : 'Built-in Local JSON DB Engine 📁'}`);
  console.log('====================================================');
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Gracefully shutting down...');
  server.close(() => {
    console.log('Process terminated.');
  });
});
