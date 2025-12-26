const contentGenerator = require('../utils/contentGenerator');

// Generate portfolio content suggestions
exports.generateContent = async (req, res) => {
    try {
        const { skills, projects, education, username } = req.body;

        // Generate content based on provided data
        const generatedContent = contentGenerator.generatePortfolioStarter({
            username,
            skills,
            projects,
            education
        });

        res.status(200).json({
            success: true,
            message: 'Content generated successfully',
            data: generatedContent
        });

    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
};
