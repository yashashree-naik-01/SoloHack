const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    // PUBLIC URL IDENTIFIER
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { type: String, required: false }, // TEMPORARY: allow legacy docs without password

    // 1. PERSONAL ESSENCE
    fullName: { type: String, default: '' }, // New Display Name
    profilePicture: { type: String, default: '' }, // Base64 Image String
    about: { type: String, default: '' },
    contact: { type: String, default: '' },
    email: { type: String, default: '' },
    dob: { type: String, default: '' }, // New DOB field

    // 2. SKILLS
    skills: { type: [String], default: [] }, // Array of skill names

    // 3. EXPERIENCE (New)
    experienceType: {
        type: String,
        enum: ['fresher', 'experienced', ''],
        default: ''
    },
    experiences: [{
        company: String,
        role: String,
        duration: String,
        details: String // Optional description
    }],

    // 4. ACHIEVEMENTS (New)
    achievements: [{
        title: String,
        image: String,
        link: String
    }],

    internships: [{
        company: String,
        role: String,
        duration: String,
        details: String
    }],

    // 4. PROFESSIONAL MILESTONES (Projects)
    projects: [{
        title: { type: String, required: true },
        description: { type: String, required: true },
        technologies: [String],
        link: String,
        githubLink: String, // Optional Repo Link
        image: String // Project Screenshot/Logo (Base64)
    }],

    // 5. ACADEMIC FOUNDATION (Education)
    education: [{
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        year: String,
        grade: String // CGPA or Percentage
    }],

    // 6. SOCIAL (New)
    social: {
        github: String,
        linkedin: String,
        twitter: String // Optional extra
    },

    // PORTFOLIO SETTINGS
    selectedTemplate: {
        type: String,
        default: 'minimal',
        enum: ['minimal', 'developer', 'creative']
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
    timestamps: true
});

// METHOD: Calculate completion percentage
portfolioSchema.methods.calculateCompletion = function () {
    let completed = 0;
    const total = 3; // Adjusted to 3 (Personal, Skills, Projects) - Education Removed

    // 1. Username (Always there)
    // 2. Personal
    const hasPersonal = this.about && this.contact && this.email;
    if (hasPersonal) completed++;

    // 3. Skills
    const hasSkills = this.skills && this.skills.length > 0;
    if (hasSkills) completed++;

    // 4. Projects
    const hasProjects = this.projects && this.projects.length > 0;
    if (hasProjects) completed++;

    // Experience, Achievements & Social are optional
    // Education REMOVED

    console.log(`\n--- COMPLETION CALC FOR ${this.username} ---`);
    console.log(`Personal: ${hasPersonal}`);
    console.log(`Skills: ${hasSkills}`);
    console.log(`Projects: ${hasProjects}`);
    console.log(`Score: ${completed}/${total}\n`);

    const percentage = Math.round((completed / total) * 100);
    this.completionPercentage = Math.min(percentage, 100);
    return this.completionPercentage;
};

// METHOD: Check if portfolio can be published
portfolioSchema.methods.canPublish = function () {
    // Looser restriction? Or strict 100%? Keeping strict for now.
    return this.completionPercentage >= 80; // Allow publishing if mostly complete
};

// MIDDLEWARE: Auto-calculate completion before saving
portfolioSchema.pre('save', function (next) {
    this.calculateCompletion();
    next();
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
