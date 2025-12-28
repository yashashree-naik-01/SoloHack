import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function LivePortfolioPreview({ username, portfolioData, template = 'minimal' }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    if (!data) {
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
            <div className="preview-header">
                {data.profilePicture && (
                    <img
                        src={data.profilePicture}
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
                    {data.fullName || data.username || 'Student Portfolio'}
                </h1>


                {/* Contact Info Row */}
                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '15px', flexWrap: 'wrap' }}>
                    {data.email && <span>📧 {data.email}</span>}
                    {data.contact && <span>📱 {data.contact}</span>}
                    {data.dob && <span>🎂 {new Date(data.dob).toLocaleDateString()}</span>}
                </div>

                {/* Social Links Row */}
                {data.social && (data.social.github || data.social.linkedin) && (
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '15px' }}>
                        {data.social.github && (
                            <a href={data.social.github} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                GitHub
                            </a>
                        )}
                        {data.social.linkedin && (
                            <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                LinkedIn
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* About Section */}
            <div className="preview-section">
                <h2 className="section-title">About Me</h2>
                {data.about ? (
                    <p className="section-content">{data.about}</p>
                ) : (
                    <p className="empty-state">No about section added yet</p>
                )}
            </div>

            {/* Experience / Internships Section */}
            {(data.experiences?.length > 0 || data.internships?.length > 0) && (
                <div className="preview-section">
                    <h2 className="section-title">
                        {data.experienceType === 'experienced' ? 'Work Experience' : 'Internships'}
                    </h2>
                    <div className="experience-list">
                        {data.experienceType === 'experienced' && data.experiences?.map((exp, i) => (
                            <div key={i} className="experience-card">
                                <h3>{exp.role}</h3>
                                <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>{exp.company}</p>
                                <p>{exp.duration}</p>
                            </div>
                        ))}

                        {data.experienceType !== 'experienced' && data.internships?.map((int, i) => (
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
            {data.achievements && data.achievements.length > 0 && (
                <div className="preview-section">
                    <h2 className="section-title">Achievements</h2>
                    <div className="achievements-list">
                        {data.achievements.map((ach, index) => (
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
                {data.skills && data.skills.length > 0 ? (
                    <div className="skills-grid">
                        {data.skills.map((skill, index) => (
                            <div key={index} className="skill-tag">
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
                {data.projects && data.projects.length > 0 ? (
                    <div className="projects-list">
                        {data.projects.map((project, index) => (
                            <div key={index} className="project-card">
                                <h3>{project.title}</h3>
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
