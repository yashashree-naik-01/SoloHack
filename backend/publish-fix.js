require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio-builder')
    .then(async () => {
        const Portfolio = mongoose.model('Portfolio', new mongoose.Schema({}, { strict: false }));

        console.log('Updating portfolio for username: abc');

        const result = await Portfolio.updateOne(
            { username: 'abc' },
            { $set: { isPublished: true } }
        );

        console.log('Update result:', result);

        const updated = await Portfolio.findOne({ username: 'abc' });
        console.log('\nAfter update:');
        console.log('isPublished =', updated.isPublished);
        console.log('completion =', updated.completionPercentage, '%');

        process.exit(0);
    });
