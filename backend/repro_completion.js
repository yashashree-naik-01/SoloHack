const mongoose = require('mongoose');
const portfolioController = require('./controllers/portfolioController');
require('dotenv').config(); // Load environment variables

// Mock Express Objects
const mockReq = (body, params = {}) => ({ body, params });
const mockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.body = null;
    res.status = function (code) {
        this.statusCode = code;
        return this;
    };
    res.json = function (data) {
        this.body = data;
        return this;
    };
    return res;
};

async function runTest() {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb+srv://yashashree:yashashree@cluster0.pzqbu.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');

        const username = 'testuser_' + Date.now();
        console.log('Testing with username:', username);

        // 1. Create Portfolio with ONLY 4 Main Sections (Expect 100%)
        // Intentionally leaving out optional sections
        const fullData = {
            username,
            fullName: 'Test User',
            about: 'About me',
            contact: '1234567890',
            email: 'test@example.com',
            dob: '2000-01-01',
            skills: ['React', 'Node'],
            experienceType: 'fresher',
            experiences: [], // Empty
            internships: [], // Empty
            projects: [{ title: 'P1', description: 'desc', technologies: ['JS'] }],
            education: [{ institution: 'Uni', degree: 'BTech', year: '2024', grade: '9.0' }],
            social: { github: '', linkedin: '' }, // Empty
            selectedTemplate: 'minimal'
        };

        console.log('\n--- Step 1: Initial Save (Expect 100%) ---');
        let req1 = mockReq(fullData);
        let res1 = mockRes();
        await portfolioController.savePortfolio(req1, res1);
        console.log(`Status: ${res1.statusCode}`);
        console.log(`Completion: ${res1.body.data.completionPercentage}%`);

        if (res1.body.data.completionPercentage !== 100) {
            console.error('FAILED: Initial save did not result in 100%');
            return;
        }

        // 2. Simulate Logout/Login (Fetch)
        console.log('\n--- Step 2: Login/Fetch (Expect 100%) ---');
        let req2 = mockReq({}, { username });
        let res2 = mockRes();
        await portfolioController.getPreviewPortfolio(req2, res2);
        const fetchedData = res2.body.data;
        console.log(`Fetched Completion: ${fetchedData.completionPercentage}%`);

        // 3. Simulate Re-Save with Fetched Data
        const reSaveData = {
            ...fullData,
            ...fetchedData
        };

        console.log('\n--- Step 3: Re-Save (Expect 100%) ---');
        let req3 = mockReq(reSaveData);
        let res3 = mockRes();
        await portfolioController.savePortfolio(req3, res3);
        console.log(`Status: ${res3.statusCode}`);
        console.log(`Completion: ${res3.body.data.completionPercentage}%`);

        if (res3.body.data.completionPercentage < 100) {
            console.error('FAIL: Re-save dropped the percentage!');
        } else {
            console.log('SUCCESS: Completion percentage maintained at 100%.');
        }

        // Cleanup
        await mongoose.connection.collection('portfolios').deleteOne({ username });

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
