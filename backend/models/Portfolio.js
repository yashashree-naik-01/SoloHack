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
        githubLink: String // Optional Repo Link
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
    const total = 6; // Increased from 4 to 6 (Added social and contact/experience checks)

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

    // 5. Education
    const hasEducation = this.education && this.education.length > 0;
    if (hasEducation) completed++;

    // 6. Experience
    let hasExperience = false;
    if (this.experienceType === 'experienced' && this.experiences.length > 0) hasExperience = true;
    else if (this.experienceType === 'fresher') hasExperience = true;
    if (hasExperience) completed++;

    // 7. Social
    const hasSocial = this.social && (this.social.github || this.social.linkedin);
    if (hasSocial) completed++;

    console.log(`\n--- COMPLETION CALC FOR ${this.username} ---`);
    console.log(`Personal: ${hasPersonal} (About: ${!!this.about}, Contact: ${!!this.contact}, Email: ${!!this.email})`);
    console.log(`Skills: ${hasSkills} (${this.skills.length})`);
    console.log(`Projects: ${hasProjects} (${this.projects.length})`);
    console.log(`Education: ${hasEducation} (${this.education.length})`);
    console.log(`Experience: ${hasExperience} (Type: ${this.experienceType})`);
    console.log(`Social: ${hasSocial}`);
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
