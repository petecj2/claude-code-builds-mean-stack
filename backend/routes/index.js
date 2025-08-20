const express = require('express');
const movieRoutes = require('./movieRoutes');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API status endpoint
router.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'Vibe Movie Database API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Mount movie routes
router.use('/movies', movieRoutes);

module.exports = router;