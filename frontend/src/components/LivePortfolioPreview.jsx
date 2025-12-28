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
                            borderRadius: '50%',
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

                    {data.experienceType === 'experienced' && data.experiences?.map((exp, i) => (
                        <div key={i} className="experience-card" style={{ marginBottom: '20px', borderLeft: '3px solid var(--primary)', paddingLeft: '15px' }}>
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{exp.role}</h3>
                            <p style={{ fontWeight: '600', color: 'var(--primary)' }}>{exp.company}</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{exp.duration}</p>
                        </div>
                    ))}

                    {data.experienceType !== 'experienced' && data.internships?.map((int, i) => (
                        <div key={i} className="experience-card" style={{ marginBottom: '20px', borderLeft: '3px solid var(--primary)', paddingLeft: '15px' }}>
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{int.role}</h3>
                            <p style={{ fontWeight: '600', color: 'var(--primary)' }}>{int.company}</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{int.duration}</p>
                        </div>
                    ))}
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
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--primary)' }}>
                                    {project.title}
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                    {project.description}
                                </p>
                                {project.technologies && project.technologies.length > 0 && (
                                    <div className="tech-tags">
                                        {project.technologies.map((tech, idx) => (
                                            <span key={idx} className="tech-tag">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Live Demo</a>}
                                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>GitHub Repo</a>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">No projects added yet</p>
                )}
            </div>

            {/* Education Section */}
            <div className="preview-section">
                <h2 className="section-title">Education</h2>
                {data.education && data.education.length > 0 ? (
                    <div className="education-list">
                        {data.education.map((edu, index) => (
                            <div key={index} className="education-card">
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--text-main)' }}>
                                    {edu.degree}
                                </h3>
                                <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '4px' }}>
                                    {edu.institution}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {edu.year && <span>Year: {edu.year}</span>}
                                    {edu.grade && <span>Grade: {edu.grade}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">No education details added yet</p>
                )}
            </div>
        </div>
    );
}

export default LivePortfolioPreview;
