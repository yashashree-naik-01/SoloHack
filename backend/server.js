const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017/portfolio-builder';

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const portfolioRoutes = require('./routes/portfolio');
const contentRoutes = require('./routes/content');
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/content', contentRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    message: 'Server running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
