import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import { API_BASE_URL } from '../config';

function LivePortfolioPreview({ username, portfolioData, template = 'minimal' }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRole, setSelectedRole] = useState('All');

    // Fetch portfolio data if username is provided
    useEffect(() => {
        if (username) {
            fetchPortfolio();
        } else if (portfolioData) {
            setData(portfolioData);
        }
    }, [username, portfolioData]);

    const fetchPortfolio = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/portfolio/preview/${username}`);
            const result = await res.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.message || 'Portfolio not found');
            }
        } catch (err) {
            setError('Failed to load portfolio');
        } finally {
            setLoading(false);
        }
    };

    // ROLE DEFINITIONS & KEYWORD MATCHING
    const ROLES = {
        'Frontend': ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'tailwind', 'bootstrap', 'sass', 'redux', 'frontend', 'ui', 'ux', 'web', 'design'],
        'Backend': ['node', 'express', 'mongodb', 'sql', 'python', 'java', 'django', 'flask', 'api', 'database', 'server', 'aws', 'backend', 'postgres', 'docker'],
        'Full Stack': ['react', 'node', 'express', 'mongodb', 'mern', 'mean', 'full stack', 'fullstack', 'javascript', 'typescript'],
        'UI/UX': ['figma', 'adobe', 'design', 'ui', 'ux', 'css', 'wireframe', 'prototype', 'canva', 'creative'],
        'Data': ['python', 'sql', 'pandas', 'numpy', 'data', 'analysis', 'machine learning', 'ai', 'statistics', 'tableau', 'power bi'],
        'Internship': ['intern', 'internship', 'student', 'project', 'beginner', 'learning']
    };

    // Helper: Calculate Relevance Score
    const getRelevance = (item, role) => {
        if (role === 'All') return { score: 1, text: '' };

        const keywords = ROLES[role];
        const textToCheck = `${item.title || ''} ${item.description || ''} ${(item.technologies || []).join(' ')} ${item.role || ''} ${item.company || ''}`.toLowerCase();

        const matches = keywords.filter(k => textToCheck.includes(k));
        const score = matches.length;

        let relevanceText = '';
        if (score > 0) {
            relevanceText = `Matches ${matches.slice(0, 3).join(', ')} relevant to ${role}`;
        }

        return { score, text: relevanceText };
    };

    // Derived Data: Sorted/Filtered
    const getProcessedData = () => {
        if (!data) return null;

        // Clone data to avoid mutation
        const processed = { ...data };

        // 1. Sort Projects
        if (processed.projects) {
            processed.projects = processed.projects.map(p => {
                const { score, text } = getRelevance(p, selectedRole);
                return { ...p, _score: score, _relevanceText: text, isRelevant: score > 0 || selectedRole === 'All' };
            }).sort((a, b) => b._score - a._score);
        }

        // 2. Sort Skills
        if (processed.skills) {
            processed.skills = [...processed.skills].map(skill => {
                const { score } = getRelevance({ title: skill }, selectedRole);
                return { name: skill, isRelevant: score > 0 || selectedRole === 'All' };
            }).sort((a, b) => {
                // Relevant first
                if (a.isRelevant && !b.isRelevant) return -1;
                if (!a.isRelevant && b.isRelevant) return 1;
                return 0;
            });
        }

        return processed;
    };

    const processedData = getProcessedData();


    if (loading) {
        return (
            <div className="preview-container">
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        🔄 Loading portfolio...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="preview-container">
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '12px',
                    border: '2px solid rgba(239, 68, 68, 0.3)'
                }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--danger)', fontWeight: '600' }}>
                        ❌ {error}
                    </p>
                </div>
            </div>
        );
    }

    if (!processedData) {
        return (
            <div className="preview-container">
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: 'rgba(100, 116, 139, 0.1)',
                    borderRadius: '12px'
                }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                        📄 Enter a username or fill the form to see preview
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`live-preview-wrapper template-${template}`}>

            {/* Recruiters View Control Bar */}
            <div className="recruiter-view-controls">
                <span>👁️ Recruiter View:</span>
                <button
                    className={`role-btn ${selectedRole === 'All' ? 'active' : ''}`}
                    onClick={() => setSelectedRole('All')}
                >
                    All
                </button>
                {Object.keys(ROLES).map(role => (
                    <button
                        key={role}
                        className={`role-btn ${selectedRole === role ? 'active' : ''}`}
                        onClick={() => setSelectedRole(role)}
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* HERO SECTION */}
            <section className="preview-section hero-section">
                <div className="content-container hero-container">
                    {processedData.profilePicture && (
                        <img src={processedData.profilePicture} alt="Profile" className="hero-photo" />
                    )}
                    <div className="hero-text">
                        <h1 className="hero-name">{processedData.fullName || 'Your Name'}</h1>
                        <p className="hero-title">{processedData.about || 'Your creative bio goes here...'}</p>
                        <div className="hero-contact-info">
                            <span>{processedData.email}</span>
                            {processedData.contact && <span> • {processedData.contact}</span>}
                            {processedData.location && <span> • {processedData.location}</span>}
                        </div>
                    </div>
                </div>
            </section>

            {/* UNIFIED SKILLS SECTION */}
            {(processedData.skills.length > 0 || (processedData.tools && processedData.tools.length > 0) || (processedData.softSkills && processedData.softSkills.length > 0)) && (
                <section className="preview-section skills-section">
                    <div className="content-container">
                        <h2>Skills & Expertise</h2>

                        {/* 1. TECHNICAL SKILLS */}
                        {processedData.skills.length > 0 && (
                            <div className="skill-category" style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.8 }}>Technical Domains</h3>
                                {template === 'developer' ? (
                                    <div className="skills-marquee-wrapper">
                                        <div className="skills-marquee-track">
                                            {[...processedData.skills, ...processedData.skills].filter(skill => {
                                                if (selectedRole === 'All') return true;
                                                return skill.isRelevant;
                                            }).map((skill, index) => (
                                                <span key={`skill-${index}`} className="skill-tag developer-skill">
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="skills-grid">
                                        {processedData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className={`skill-box ${skill.isRelevant ? 'highlight-skill' : 'dimmed-skill'}`}
                                            >
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. TOOLS & SOFTWARE */}
                        {processedData.tools && processedData.tools.length > 0 && (
                            <div className="skill-category" style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.8 }}>Tools & Software</h3>
                                {template === 'developer' ? (
                                    <div className="skills-marquee-wrapper">
                                        <div className="skills-marquee-track" style={{ animationDirection: 'reverse' }}>
                                            {[...processedData.tools, ...processedData.tools].map((tool, index) => (
                                                <span key={`tool-${index}`} className="skill-tag developer-skill">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="skills-grid">
                                        {processedData.tools.map((tool, index) => (
                                            <span key={index} className="skill-box">{tool}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. SOFT SKILLS */}
                        {processedData.softSkills && processedData.softSkills.length > 0 && (
                            <div className="skill-category">
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.8 }}>Soft Skills</h3>
                                <div className="skills-grid">
                                    {processedData.softSkills.map((skill, index) => (
                                        <span key={index} className="skill-box">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* WORK EXPERIENCE */}
            {(processedData.experiences?.length > 0 || processedData.internships?.length > 0) && (
                <section className="preview-section experience-section">
                    <div className="content-container">
                        <h2>Experience</h2>
                        <div className="experience-list">
                            {processedData.experienceType === 'experienced' && processedData.experiences?.map((exp, index) => (
                                <div key={index} className="experience-card card-style">
                                    <div className="card-header">
                                        <h3>{exp.role}</h3>
                                        <span className="company-name">@ {exp.company}</span>
                                    </div>
                                    <span className="duration">{exp.duration}</span>
                                    <p>{exp.description}</p>
                                </div>
                            ))}
                            {processedData.experienceType !== 'experienced' && processedData.internships?.map((int, index) => (
                                <div key={index} className="experience-card card-style">
                                    <div className="card-header">
                                        <h3>{int.role}</h3>
                                        <span className="company-name">@ {int.company}</span>
                                    </div>
                                    <span className="duration">{int.duration}</span>
                                    <p>{int.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PROJECTS SECTION */}
            {(processedData.projects && processedData.projects.length > 0) && (
                <section className="preview-section projects-section">
                    <div className="content-container">
                        <h2>Projects</h2>
                        <div className="projects-grid">
                            {processedData.projects.map((project, index) => (
                                <div key={index} className={`project-card card-style ${project.isRelevant ? 'relevant-project' : 'dimmed-project'}`}>
                                    {project.image && (
                                        <div className="project-image-container">
                                            <img src={project.image} alt={project.title} className="project-thumb" />
                                        </div>
                                    )}
                                    <div className="project-content">
                                        <div className="project-header">
                                            <h3>{project.title}</h3>
                                            {project._relevanceText && <span className="relevance-badge">{project._relevanceText}</span>}
                                        </div>
                                        <p>{project.description}</p>
                                        <div className="tech-stack">
                                            {project.technologies?.map((tech, i) => (
                                                <span key={i} className="tech-tag">{tech}</span>
                                            ))}
                                        </div>
                                        <div className="project-links">
                                            {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer">Live Demo</a>}
                                            {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ACHIEVEMENTS SECTION (Refactored to match Project Card style) */}
            {(processedData.achievements && processedData.achievements.length > 0) && (
                <section className="preview-section achievements-section">
                    <div className="content-container">
                        <h2>Achievements</h2>
                        <div className="achievements-grid">
                            {processedData.achievements.map((ach, index) => (
                                <div key={index} className="achievement-card card-style">
                                    {ach.image && (
                                        <div className="achievement-image-container">
                                            <img src={ach.image} alt={ach.title} className="achievement-thumb" />
                                        </div>
                                    )}
                                    <div className="achievement-content">
                                        <h3>{ach.title}</h3>
                                        <p>{ach.description}</p>
                                        {ach.link && <a href={ach.link} target="_blank" rel="noopener noreferrer">View Certificate</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* EDUCATION SECTION */}
            {(processedData.education && processedData.education.length > 0) && (
                <section className="preview-section education-section">
                    <div className="content-container">
                        <h2>Education</h2>
                        <div className="education-grid">
                            {processedData.education.map((edu, index) => (
                                <div key={index} className="education-card card-style">
                                    <h3>{edu.degree}</h3>
                                    <p className="institution">{edu.institution}</p>
                                    <span className="year">{edu.year}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FOOTER */}
            {/* FOOTER */}
            <footer className="preview-footer">
                <div className="content-container">
                    <div className="footer-socials">
                        {processedData.social?.github && (
                            <a href={processedData.social.github} target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Github size={24} />
                            </a>
                        )}
                        {processedData.social?.linkedin && (
                            <a href={processedData.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                                <Linkedin size={24} />
                            </a>
                        )}
                        {processedData.email && (
                            <a href={`mailto:${processedData.email}`} className="social-icon">
                                <Mail size={24} />
                            </a>
                        )}
                    </div>
                    <p>© {new Date().getFullYear()} {processedData.fullName || processedData.username}. Built with SoloHack.</p>
                </div>
            </footer>
        </div>
    );
}

export default LivePortfolioPreview;
