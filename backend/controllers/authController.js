const Portfolio = require('../models/Portfolio');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret Key (Should be in .env but hardcoding for hackathon speed if missing)
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_secret_key_123';

// Signup
exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email already exists
        const existingEmail = await Portfolio.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Generate unique username from Full Name
        // e.g. "John Doe" -> "johndoe" + random 4 digits
        const baseName = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 digit random
        const generatedUsername = `${baseName}${randomSuffix}`;

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User (Portfolio Doc)
        const newUser = new Portfolio({
            username: generatedUsername,
            fullName: fullName,
            email,
            password: hashedPassword,
            // Initialize defaults
            about: '',
            skills: [],
            projects: [],
            education: []
        });

        await newUser.save();

        // Generate Token
        const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            token,
            username: newUser.username, // Return generated username for frontend
            message: 'User registered successfully'
        });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Check User by Email
        const user = await Portfolio.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate Token
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            token,
            username: user.username, // Send username for routing
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
