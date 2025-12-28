const Portfolio = require('../models/Portfolio');

// Save or update portfolio data
exports.savePortfolio = async (req, res) => {
    console.log("🔥 SAVE REQUEST RECEIVED 🔥 - Body:", JSON.stringify(req.body, null, 2)); // DEBUG LOG
    try {
        const {
            username,
            fullName, // Added fullName
            profilePicture, // New Profile Picture
            about,
            contact,
            email,
            dob, // Added dob
            skills,
            experienceType,
            experiences,
            internships,
            projects,
            education,
            social,
            selectedTemplate
        } = req.body;

        // Validate username
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Find existing portfolio
        let portfolio = await Portfolio.findOne({ username });

        if (!portfolio) {
            // User MUST exist (created via Signup). Cannot create ghost user here because Logic requires Password.
            // This happens if LocalStorage has a stale username that was deleted from DB.
            console.log(`Save failed: User ${username} not found in DB.`);
            return res.status(404).json({ error: 'User not found. Please Logout and Login again.' });
        }

        // Update existing portfolio
        portfolio.fullName = fullName || portfolio.fullName;
        portfolio.profilePicture = profilePicture || portfolio.profilePicture;
        portfolio.about = about || portfolio.about;
        portfolio.contact = contact || portfolio.contact;
        portfolio.email = email || portfolio.email;
        portfolio.dob = dob || portfolio.dob;
        portfolio.skills = skills || portfolio.skills;
        portfolio.experienceType = experienceType || portfolio.experienceType;
        portfolio.experiences = experiences || portfolio.experiences;
        portfolio.internships = internships || portfolio.internships;
        portfolio.projects = projects || portfolio.projects;
        portfolio.education = education || portfolio.education;
        portfolio.social = social || portfolio.social;
        portfolio.selectedTemplate = selectedTemplate || portfolio.selectedTemplate;

        // Save (completion is auto-calculated by pre-save hook)
        await portfolio.save();

        res.status(200).json({
            success: true,
            message: 'Portfolio saved successfully',
            data: {
                username: portfolio.username,
                completionPercentage: portfolio.completionPercentage,
                canPublish: portfolio.canPublish(),
                isPublished: portfolio.isPublished
            }
        });

    } catch (error) {
        console.error('Error saving portfolio:', error);

        // Handle duplicate username error
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Return specific error message for debugging
        res.status(500).json({ error: error.message || 'Failed to save portfolio' });
    }
};

// Publish portfolio (only if 100% complete)
exports.publishPortfolio = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const portfolio = await Portfolio.findOne({ username });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        // Check if portfolio is complete
        if (!portfolio.canPublish()) {
            return res.status(400).json({
                error: 'Portfolio incomplete',
                message: `Portfolio is ${portfolio.completionPercentage}% complete. Must be 100% to publish.`,
                completionPercentage: portfolio.completionPercentage
            });
        }

        // Publish portfolio
        console.log('Publishing portfolio for:', username);
        console.log('Before publish - isPublished:', portfolio.isPublished);

        portfolio.isPublished = true;
        await portfolio.save();

        console.log('After publish - isPublished:', portfolio.isPublished);
        console.log('Portfolio published successfully for:', username);

        res.status(200).json({
            success: true,
            message: 'Portfolio published successfully',
            data: {
                username: portfolio.username,
                isPublished: portfolio.isPublished,
                completionPercentage: portfolio.completionPercentage
            }
        });

    } catch (error) {
        console.error('Error publishing portfolio:', error);
        res.status(500).json({ error: 'Failed to publish portfolio' });
    }
};

// Get portfolio for preview (no publish check - allows viewing unpublished portfolios)
exports.getPreviewPortfolio = async (req, res) => {
    try {
        const { username } = req.params;

        // Find portfolio by username
        const portfolio = await Portfolio.findOne({ username });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        // Return portfolio data regardless of publish status (for preview)
        res.status(200).json({
            success: true,
            data: {
                username: portfolio.username,
                fullName: portfolio.fullName, // New
                profilePicture: portfolio.profilePicture, // New
                about: portfolio.about,
                contact: portfolio.contact, // New
                email: portfolio.email, // New
                dob: portfolio.dob, // New
                skills: portfolio.skills,
                experienceType: portfolio.experienceType, // New
                experiences: portfolio.experiences, // New
                internships: portfolio.internships, // New
                projects: portfolio.projects,
                education: portfolio.education,
                social: portfolio.social, // New
                selectedTemplate: portfolio.selectedTemplate,
                completionPercentage: portfolio.completionPercentage,
                isPublished: portfolio.isPublished,
                createdAt: portfolio.createdAt,
                updatedAt: portfolio.updatedAt
            }
        });

    } catch (error) {
        console.error('Error fetching preview portfolio:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
};

// Get public portfolio (only if published)
exports.getPublicPortfolio = async (req, res) => {
    try {
        const { username } = req.params;

        // Find portfolio by username
        const portfolio = await Portfolio.findOne({ username });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        // Check if portfolio is published
        if (!portfolio.isPublished) {
            return res.status(403).json({
                error: 'Portfolio not published',
                message: 'This portfolio is not publicly accessible yet.'
            });
        }

        // Return public portfolio data
        res.status(200).json({
            success: true,
            data: {
                username: portfolio.username,
                fullName: portfolio.fullName, // New
                profilePicture: portfolio.profilePicture, // New
                about: portfolio.about,
                contact: portfolio.contact, // New
                email: portfolio.email, // New
                dob: portfolio.dob, // New
                skills: portfolio.skills,
                experienceType: portfolio.experienceType, // New
                experiences: portfolio.experiences, // New
                internships: portfolio.internships, // New
                projects: portfolio.projects,
                education: portfolio.education,
                social: portfolio.social, // New
                selectedTemplate: portfolio.selectedTemplate,
                completionPercentage: portfolio.completionPercentage,
                isPublished: true,
                createdAt: portfolio.createdAt,
                updatedAt: portfolio.updatedAt
            }
        });

    } catch (error) {
        console.error('Error fetching public portfolio:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
};

// Delete portfolio
exports.deletePortfolio = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const portfolio = await Portfolio.findOneAndDelete({ username });

        if (!portfolio) {
            return res.status(404).json({ error: 'Portfolio not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Portfolio deleted successfully',
            data: {
                username: portfolio.username
            }
        });

    } catch (error) {
        console.error('Error deleting portfolio:', error);
        res.status(500).json({ error: 'Failed to delete portfolio' });
    }
};
