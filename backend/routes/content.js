const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Generate portfolio content
router.post('/generate', contentController.generateContent);

module.exports = router;
