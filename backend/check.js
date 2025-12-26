require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio-builder')
    .then(async () => {
        const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({}, { strict: false }));
        const p = await Portfolio.findOne({ username: 'abc' });

        if (p) {
            console.log('isPublished =', p.isPublished);
            console.log('completion =', p.completionPercentage, '%');
            console.log('template =', p.selectedTemplate);
        } else {
            console.log('NOT FOUND');
        }

        process.exit(0);
    });
