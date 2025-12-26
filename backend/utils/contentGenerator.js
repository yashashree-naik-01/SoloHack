/**
 * Auto-Generated Portfolio Content Utility
 * Simple template-based text generation for student portfolios
 */

// Generate "About Me" section from skills and education
exports.generateAbout = (skills = [], education = []) => {
    if (skills.length === 0 && education.length === 0) {
        return "I am a passionate student developer eager to learn and grow.";
    }

    let aboutText = "I am a student developer";

    // Add skills if provided
    if (skills.length > 0) {
        const skillsList = formatList(skills);
        aboutText += ` with experience in ${skillsList}`;
    }

    // Add education if provided
    if (education.length > 0) {
        const degree = education[0].degree;
        const institution = education[0].institution;
        aboutText += `. Currently pursuing ${degree} at ${institution}`;
    }

    aboutText += ". I am passionate about building innovative solutions and continuously improving my skills.";

    return aboutText;
};

// Generate skill summary
exports.generateSkillSummary = (skills = []) => {
    if (skills.length === 0) {
        return "Developing proficiency in various technologies.";
    }

    const skillsList = formatList(skills);
    return `Proficient in ${skillsList}. Always eager to learn new technologies and best practices.`;
};

// Generate project description enhancement
exports.enhanceProjectDescription = (projectTitle, technologies = []) => {
    if (technologies.length === 0) {
        return `A project focused on solving real-world problems through innovative solutions.`;
    }

    const techList = formatList(technologies);
    return `A comprehensive project built using ${techList}, demonstrating practical application of modern development practices and problem-solving skills.`;
};

// Generate education summary
exports.generateEducationSummary = (education = []) => {
    if (education.length === 0) {
        return "Currently pursuing higher education in technology.";
    }

    const { degree, institution, year } = education[0];
    let summary = `${degree} student at ${institution}`;

    if (year) {
        summary += ` (Expected graduation: ${year})`;
    }

    summary += ". Focused on building strong foundations in computer science and software development.";

    return summary;
};

// Generate complete portfolio starter content
exports.generatePortfolioStarter = (data = {}) => {
    const { username, skills, projects, education } = data;

    return {
        about: exports.generateAbout(skills, education),
        skillSummary: exports.generateSkillSummary(skills),
        educationSummary: exports.generateEducationSummary(education),
        suggestions: {
            bio: `Hi, I'm ${username || 'a student developer'}. Welcome to my portfolio!`,
            tagline: "Building the future, one line of code at a time.",
            contact: "Feel free to reach out for collaboration or learning opportunities!"
        }
    };
};

// Helper: Format array into readable list
function formatList(items) {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;

    const lastItem = items[items.length - 1];
    const otherItems = items.slice(0, -1).join(", ");
    return `${otherItems}, and ${lastItem}`;
}
