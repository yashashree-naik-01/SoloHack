const Portfolio = require('../models/Portfolio');

// Save or update portfolio data
exports.savePortfolio = async (req, res) => {
    try {
        const { username, about, skills, projects, education, selectedTemplate } = req.body;

        // Validate username
        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Find existing portfolio or create new one
        let portfolio = await Portfolio.findOne({ username });

        if (portfolio) {
            // Update existing portfolio
            portfolio.about = about || portfolio.about;
            portfolio.skills = skills || portfolio.skills;
            portfolio.projects = projects || portfolio.projects;
            portfolio.education = education || portfolio.education;
            portfolio.selectedTemplate = selectedTemplate || portfolio.selectedTemplate;
        } else {
            // Create new portfolio
            portfolio = new Portfolio({
                username,
                about,
                skills,
                projects,
                education,
                selectedTemplate
            });
        }

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

        res.status(500).json({ error: 'Failed to save portfolio' });
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
        portfolio.isPublished = true;
        await portfolio.save();

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
                about: portfolio.about,
                skills: portfolio.skills,
                projects: portfolio.projects,
                education: portfolio.education,
                selectedTemplate: portfolio.selectedTemplate,
                completionPercentage: portfolio.completionPercentage,
                createdAt: portfolio.createdAt,
                updatedAt: portfolio.updatedAt
            }
        });

    } catch (error) {
        console.error('Error fetching public portfolio:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
};
