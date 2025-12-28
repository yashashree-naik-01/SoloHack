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
        <div className={`preview-container template-${template}`}>

            {/* --- RECRUITER VIEW CONTROLS --- */}
            <div className="recruiter-controls" style={{
                marginBottom: '40px',
                background: 'var(--bg-card)',
                padding: '15px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                textAlign: 'center',
                border: '1px solid var(--border-color)'
            }}>
                <span style={{ fontWeight: '600', color: 'var(--text-muted)', marginRight: '15px', fontSize: '0.9rem' }}>
                    👀 VIEW AS:
                </span>
                <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {['All', 'Frontend', 'Backend', 'Full Stack', 'UI/UX', 'Data'].map(role => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            style={{
                                background: selectedRole === role ? 'var(--primary)' : 'transparent',
                                color: selectedRole === role ? '#fff' : 'var(--text-secondary)',
                                border: `1px solid ${selectedRole === role ? 'var(--primary)' : 'var(--border-color)'}`,
                                padding: '6px 14px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            {role}
                        </button>
                    ))}
                </div>
                {selectedRole !== 'All' && (
                    <div style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--accent)' }}>
                        ✨ Highlighting content relevant for <strong>{selectedRole}</strong> roles
                    </div>
                )}
            </div>

            <div className="preview-header">
                {processedData.profilePicture && (
                    <img
                        src={processedData.profilePicture}
                        alt="Profile"
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            marginBottom: '20px',
                            border: '4px solid var(--primary)'
                        }}
                    />
                )}
                <h1 style={{ fontSize: '2.5rem', marginBottom: '8px', color: 'var(--text-main)' }}>
                    {processedData.fullName || processedData.username || 'Student Portfolio'}
                </h1>


                {/* Contact Info Row */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '15px', flexWrap: 'wrap' }}>
                    {processedData.email && <span>📧 {processedData.email}</span>}
                    {processedData.contact && <span>📱 {processedData.contact}</span>}
                    {processedData.dob && <span>🎂 {new Date(processedData.dob).toLocaleDateString()}</span>}
                </div>

                {/* Social Links Row */}
                {processedData.social && (processedData.social.github || processedData.social.linkedin) && (
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '15px' }}>
                        {processedData.social.github && (
                            <a href={processedData.social.github} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                GitHub
                            </a>
                        )}
                        {processedData.social.linkedin && (
                            <a href={processedData.social.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                LinkedIn
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* About Section */}
            <div className="preview-section">
                <h2 className="section-title">About Me</h2>
                {processedData.about ? (
                    <p className="section-content">{processedData.about}</p>
                ) : (
                    <p className="empty-state">No about section added yet</p>
                )}
            </div>

            {/* Experience / Internships Section */}
            {(processedData.experiences?.length > 0 || processedData.internships?.length > 0) && (
                <div className="preview-section">
                    <h2 className="section-title">
                        {processedData.experienceType === 'experienced' ? 'Work Experience' : 'Internships'}
                    </h2>
                    <div className="experience-list">
                        {processedData.experienceType === 'experienced' && processedData.experiences?.map((exp, i) => (
                            <div key={i} className="experience-card">
                                <h3>{exp.role}</h3>
                                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{exp.company}</p>
                                <p>{exp.duration}</p>
                            </div>
                        ))}

                        {processedData.experienceType !== 'experienced' && processedData.internships?.map((int, i) => (
                            <div key={i} className="experience-card">
                                <h3>{int.role}</h3>
                                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{int.company}</p>
                                <p>{int.duration}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievements Section */}
            {processedData.achievements && processedData.achievements.length > 0 && (
                <div className="preview-section">
                    <h2 className="section-title">Achievements</h2>
                    <div className="achievements-list">
                        {processedData.achievements.map((ach, index) => (
                            <div key={index} className="experience-card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                {ach.image && (
                                    <img
                                        src={ach.image}
                                        alt={ach.title}
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '12px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                                <div>
                                    <h3 style={{ marginBottom: '5px' }}>{ach.title}</h3>
                                    {ach.link && (
                                        <a
                                            href={ach.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}
                                        >
                                            View Certificate →
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills Section */}
            <div className="preview-section">
                <h2 className="section-title">Skills</h2>
                {processedData.skills && processedData.skills.length > 0 ? (
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
                ) : (
                    <p className="empty-state">No skills added yet</p>
                )}
            </div>

            {/* Projects Section */}
            <div className="preview-section">
                <h2 className="section-title">Projects</h2>
                {processedData.projects && processedData.projects.length > 0 ? (
                    <div className="projects-list">
                        {processedData.projects.map((project, index) => (
                            <div key={index} className="project-card" style={{
                                opacity: selectedRole === 'All' || project._score > 0 ? 1 : 0.5,
                                transform: selectedRole !== 'All' && project._score === 0 ? 'scale(0.98)' : 'none'
                            }}>
                                {project.image && (
                                    <img
                                        src={project.image}
                                        alt="Project"
                                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '15px' }}
                                    />
                                )}
                                <h3>{project.title}</h3>
                                {selectedRole !== 'All' && project._relevanceText && (
                                    <div style={{
                                        marginBottom: '10px',
                                        fontSize: '0.85rem',
                                        color: '#059669',
                                        background: '#ecfdf5',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        display: 'inline-block'
                                    }}>
                                        💡 {project._relevanceText}
                                    </div>
                                )}
                                <p>{project.description}</p>
                                {project.technologies && project.technologies.length > 0 && (
                                    <div style={{ marginTop: '15px' }}>
                                        {project.technologies.map((tech, idx) => (
                                            <span key={idx} className="skill-tag" style={{ fontSize: '0.8rem', padding: '4px 12px', marginRight: '5px' }}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
                                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'none' }}>Live Demo</a>}
                                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub</a>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">No projects added yet</p>
                )}
            </div>


        </div>
    );
}

export default LivePortfolioPreview;
