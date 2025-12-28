import { useState, useEffect } from 'react';
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
                return { ...p, _score: score, _relevanceText: text };
            }).sort((a, b) => b._score - a._score);
        }

        // 2. Sort Skills
        if (processed.skills) {
            processed.skills = [...processed.skills].sort((a, b) => {
                const scoreA = getRelevance({ title: a }, selectedRole).score;
                const scoreB = getRelevance({ title: b }, selectedRole).score;
                return scoreB - scoreA;
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
        <div className={`portfolio-wrapper template-${template}`}>

            {/* --- RECRUITER VIEW CONTROLS (Sticky Top) --- */}
            <div className="recruiter-bar-wrapper">
                <div className="recruiter-controls">
                    <span className="view-label">👀 View as Recruiter:</span>
                    <div className="role-buttons">
                        {['All', 'Frontend', 'Backend', 'Full Stack', 'UI/UX', 'Data'].map(role => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={selectedRole === role ? 'role-btn active' : 'role-btn'}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                </div>
                {selectedRole !== 'All' && (
                    <div className="role-hint">
                        ✨ Highlighting content relevant for <strong>{selectedRole}</strong> roles
                    </div>
                )}
            </div>

            {/* HERO SECTION */}
            <section className="section-hero">
                <div className="content-container">
                    <div className="hero-content">
                        {processedData.profilePicture && (
                            <img
                                src={processedData.profilePicture}
                                alt="Profile"
                                className="hero-img"
                            />
                        )}
                        <h1 className="hero-name">
                            {processedData.fullName || processedData.username || 'Student Name'}
                        </h1>
                        <p className="hero-role">
                            {processedData.about ? processedData.about.split('.')[0] + '.' : 'Aspiring Professional'}
                        </p>

                        <div className="hero-links">
                            {processedData.email && <span className="icon-link">📧 {processedData.email}</span>}
                            {processedData.social?.github && (
                                <a href={processedData.social.github} target="_blank" rel="noreferrer" className="social-btn">GitHub</a>
                            )}
                            {processedData.social?.linkedin && (
                                <a href={processedData.social.linkedin} target="_blank" rel="noreferrer" className="social-btn">LinkedIn</a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            {processedData.about && (
                <section className="section-about">
                    <div className="content-container">
                        <h2 className="section-title">About Me</h2>
                        <div className="about-text">
                            <p>{processedData.about}</p>
                        </div>
                        <div className="personal-details">
                            {processedData.contact && <span><strong>Phone:</strong> {processedData.contact}</span>}
                            {processedData.dob && <span><strong>Born:</strong> {new Date(processedData.dob).toLocaleDateString()}</span>}
                        </div>
                    </div>
                </section>
            )}

            {/* SKILLS SECTION (Moved up for better flow) */}
            {processedData.skills && processedData.skills.length > 0 && (
                <section className="section-skills">
                    <div className="content-container">
                        <h2 className="section-title">Technical Skills</h2>
                        <div className="skills-grid">
                            {processedData.skills.map((skill, index) => (
                                <div key={index} className="skill-tag" style={{
                                    opacity: selectedRole === 'All' ? 1 : (getRelevance({ title: skill }, selectedRole).score > 0 ? 1 : 0.4),
                                    order: selectedRole === 'All' ? 0 : (getRelevance({ title: skill }, selectedRole).score > 0 ? -1 : 1)
                                }}>
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* EXPERIENCE SECTION */}
            {(processedData.experiences?.length > 0 || processedData.internships?.length > 0) && (
                <section className="section-experience">
                    <div className="content-container">
                        <h2 className="section-title">
                            {processedData.experienceType === 'experienced' ? 'Experience' : 'Internships'}
                        </h2>
                        <div className="experience-grid">
                            {processedData.experienceType === 'experienced' && processedData.experiences?.map((exp, i) => (
                                <div key={i} className="experience-card">
                                    <div className="exp-header">
                                        <h3>{exp.role}</h3>
                                        <span className="exp-company">{exp.company}</span>
                                    </div>
                                    <p className="exp-duration">{exp.duration}</p>
                                </div>
                            ))}

                            {processedData.experienceType !== 'experienced' && processedData.internships?.map((int, i) => (
                                <div key={i} className="experience-card">
                                    <div className="exp-header">
                                        <h3>{int.role}</h3>
                                        <span className="exp-company">{int.company}</span>
                                    </div>
                                    <p className="exp-duration">{int.duration}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PROJECTS SECTION */}
            {processedData.projects && processedData.projects.length > 0 && (
                <section className="section-projects">
                    <div className="content-container">
                        <h2 className="section-title">Featured Projects</h2>
                        <div className="projects-grid">
                            {processedData.projects.map((project, index) => (
                                <div key={index} className="project-card" style={{
                                    opacity: selectedRole === 'All' || project._score > 0 ? 1 : 0.5,
                                    transform: selectedRole !== 'All' && project._score === 0 ? 'scale(0.98)' : 'none'
                                }}>
                                    {project.image && (
                                        <div className="project-img-wrapper">
                                            <img src={project.image} alt={project.title} />
                                        </div>
                                    )}
                                    <div className="project-content">
                                        <h3>{project.title}</h3>
                                        {selectedRole !== 'All' && project._relevanceText && (
                                            <div className="relevance-badge">
                                                💡 {project._relevanceText}
                                            </div>
                                        )}
                                        <p>{project.description}</p>
                                        <div className="tech-stack">
                                            {project.technologies?.map((tech, idx) => (
                                                <span key={idx} className="tech-pill">{tech}</span>
                                            ))}
                                        </div>
                                        <div className="project-links">
                                            {project.link && <a href={project.link} target="_blank" rel="noreferrer">Live Demo →</a>}
                                            {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer">GitHub ↗</a>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ACHIEVEMENTS SECTION */}
            {processedData.achievements && processedData.achievements.length > 0 && (
                <section className="section-achievements">
                    <div className="content-container">
                        <h2 className="section-title">Achievements</h2>
                        <div className="achievements-grid">
                            {processedData.achievements.map((ach, index) => (
                                <div key={index} className="achievement-card">
                                    {ach.image && <img src={ach.image} alt={ach.title} />}
                                    <div className="ach-info">
                                        <h4>{ach.title}</h4>
                                        {ach.link && <a href={ach.link} target="_blank" rel="noreferrer">View Certificate</a>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FOOTER */}
            <footer className="portfolio-footer">
                <div className="content-container">
                    <p>© {new Date().getFullYear()} {processedData.fullName || processedData.username}. Built with SoloHack.</p>
                </div>
            </footer>

        </div>
    );
}

export default LivePortfolioPreview;
