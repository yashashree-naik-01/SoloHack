const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Save or update portfolio
router.post('/save', portfolioController.savePortfolio);

// Publish portfolio
router.post('/publish', portfolioController.publishPortfolio);

// Get public portfolio (no authentication required)
router.get('/:username', portfolioController.getPublicPortfolio);

module.exports = router;
