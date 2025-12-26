const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

// Save or update portfolio
router.post('/save', portfolioController.savePortfolio);

// Publish portfolio
router.post('/publish', portfolioController.publishPortfolio);

// Get portfolio for preview (no publish check)
router.get('/preview/:username', portfolioController.getPreviewPortfolio);

// Get public portfolio (no authentication required)
router.get('/:username', portfolioController.getPublicPortfolio);

// Delete portfolio
router.delete('/delete', portfolioController.deletePortfolio);

module.exports = router;
