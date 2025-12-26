const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    // PUBLIC URL IDENTIFIER
    // Used in: /portfolio/:username
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    // MANDATORY SECTIONS (required for 100% completion)
    about: {
        type: String,
        default: ''
    },

    skills: {
        type: [String], // Array of skill names
        default: []
    },

    projects: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        technologies: [String],
        link: String
    }],

    education: [{
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        year: String
    }],

    // PORTFOLIO SETTINGS
    selectedTemplate: {
        type: String,
        default: 'default',
        enum: ['default', 'minimal', 'modern']
    },

    isPublished: {
        type: Boolean,
        default: false
    },

    completionPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
}, {
    timestamps: true // Auto-creates createdAt and updatedAt
});

// METHOD: Calculate completion percentage
portfolioSchema.methods.calculateCompletion = function () {
    let completed = 0;
    const total = 4; // 4 mandatory sections

    // Check each mandatory section
    if (this.about && this.about.trim().length > 0) completed++;
    if (this.skills && this.skills.length > 0) completed++;
    if (this.projects && this.projects.length > 0) completed++;
    if (this.education && this.education.length > 0) completed++;

    const percentage = Math.round((completed / total) * 100);
    this.completionPercentage = percentage;
    return percentage;
};

// METHOD: Check if portfolio can be published
portfolioSchema.methods.canPublish = function () {
    return this.completionPercentage === 100;
};

// MIDDLEWARE: Auto-calculate completion before saving
portfolioSchema.pre('save', function (next) {
    this.calculateCompletion();
    next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
