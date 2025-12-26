require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio-builder';

async function checkPortfolio() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({}, { strict: false }));

        const portfolio = await Portfolio.findOne({ username: 'abc' });

        if (portfolio) {
            console.log('\n=== Portfolio "abc" ===');
            console.log('isPublished:', portfolio.isPublished);
            console.log('completionPercentage:', portfolio.completionPercentage);
            console.log('selectedTemplate:', portfolio.selectedTemplate);
        } else {
            console.log('Portfolio not found for username: abc');
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkPortfolio();
