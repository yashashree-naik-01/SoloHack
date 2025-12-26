import { useState } from 'react';
import { API_BASE_URL } from '../config';

function PortfolioForm() {
    // State for form inputs
    const [username, setUsername] = useState('');
    const [about, setAbout] = useState('');
    const [skills, setSkills] = useState('');

    // Projects fields
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [projectTech, setProjectTech] = useState('');
    const [projects, setProjects] = useState([]);

    // Education fields
    const [institution, setInstitution] = useState('');
    const [degree, setDegree] = useState('');
    const [year, setYear] = useState('');
    const [education, setEducation] = useState([]);

    // Response from backend
    const [response, setResponse] = useState(null);

    // Add project to list
    const addProject = () => {
        if (projectTitle && projectDescription) {
            const newProject = {
                title: projectTitle,
                description: projectDescription,
                technologies: projectTech.split(',').map(t => t.trim()).filter(t => t),
                link: ''
            };
            setProjects([...projects, newProject]);
            setProjectTitle('');
            setProjectDescription('');
            setProjectTech('');
        } else {
            alert('⚠️ Please fill project title and description');
        }
    };

    // Add education to list
    const addEducation = () => {
        if (institution && degree) {
            const newEducation = { institution, degree, year };
            setEducation([...education, newEducation]);
            setInstitution('');
            setDegree('');
            setYear('');
        } else {
            alert('⚠️ Please fill institution and degree');
        }
    };

    // Submit portfolio to backend
    const handleSubmit = async () => {
        if (!username) {
            alert('⚠️ Username is required!');
            return;
        }

        const portfolioData = {
            username,
            about,
            skills: skills.split(',').map(s => s.trim()).filter(s => s),
            projects,
            education
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/portfolio/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(portfolioData)
            });

            const data = await res.json();
            setResponse(data);

            if (data.success) {
                alert(`✅ Portfolio saved! Completion: ${data.data.completionPercentage}%`);
            } else {
                alert('❌ Error: ' + data.error);
            }
        } catch (error) {
            alert('❌ Error connecting to backend: ' + error.message);
        }
    };

    // Publish portfolio
    const handlePublish = async () => {
        if (!username) {
            alert('⚠️ Username is required to publish!');
            return;
        }

        if (response && response.data && response.data.completionPercentage < 100) {
            alert('⚠️ Cannot publish! Portfolio must be 100% complete.');
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/portfolio/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            const data = await res.json();

            if (data.success) {
                alert('🎉 Portfolio published successfully!');
                setResponse(prev => ({
                    ...prev,
                    data: { ...prev.data, isPublished: true }
                }));
            } else {
                alert('❌ Error: ' + (data.message || data.error));
            }
        } catch (error) {
            alert('❌ Error connecting to backend: ' + error.message);
        }
    };

    return (
        <div className="card glass">
            <h2>Craft Your Identity</h2>

            {/* Basic Info */}
            <div className="section-header">
                <h3>Personal Essence</h3>
            </div>

            <div className="form-group">
                <label>👤 Global Username (required) *</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                />
            </div>

            <div className="form-group">
                <label>✍️ The Story of You</label>
                <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Describe your professional journey and aspirations..."
                    rows={4}
                />
            </div>

            <div className="form-group">
                <label>💡 Specialized Skills (comma-separated)</label>
                <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, AI, Full-Stack Design"
                />
            </div>

            {/* Projects Section */}
            <div className="section-header">
                <h3>🚀 Professional Milestones</h3>
            </div>

            <div className="glass-inner-section">
                <div className="form-group">
                    <label>Project Title</label>
                    <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g., Solar Portfolio Builder"
                    />
                </div>

                <div className="form-group">
                    <label>Project Description</label>
                    <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="What problem did you solve?"
                        style={{ minHeight: '80px' }}
                    />
                </div>

                <div className="form-group">
                    <label>Technologies</label>
                    <input
                        type="text"
                        value={projectTech}
                        onChange={(e) => setProjectTech(e.target.value)}
                        placeholder="comma-separated list"
                    />
                </div>

                <button onClick={addProject} className="btn-secondary" style={{ width: '100%' }}>
                    ➕ Add Project
                </button>

                {projects.length > 0 && (
                    <div className="item-list">
                        <p style={{ fontWeight: '700', color: 'var(--solar-gold)', marginBottom: '12px' }}>
                            {projects.length} Saved Projects
                        </p>
                        {projects.map((proj, index) => (
                            <div key={index} className="item">
                                <span style={{ fontSize: '1.2rem' }}>📦</span>
                                {proj.title}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Education Section */}
            <div className="section-header">
                <h3>🎓 Academic Foundation</h3>
            </div>

            <div className="glass-inner-section">
                <div className="form-group">
                    <label>Institution</label>
                    <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="University Name"
                    />
                </div>

                <div className="form-group">
                    <label>Degree / Certification</label>
                    <input
                        type="text"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="e.g., B.Tech in Computer Science"
                    />
                </div>

                <div className="form-group">
                    <label>Year of Graduation</label>
                    <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="e.g., 2025"
                    />
                </div>

                <button onClick={addEducation} className="btn-secondary" style={{ width: '100%' }}>
                    ➕ Add Education Entree
                </button>

                {education.length > 0 && (
                    <div className="item-list">
                        <p style={{ fontWeight: '700', color: 'var(--solar-gold)', marginBottom: '12px' }}>
                            {education.length} Academic Entries
                        </p>
                        {education.map((edu, index) => (
                            <div key={index} className="item">
                                <span style={{ fontSize: '1.2rem' }}>🏫</span>
                                {edu.degree} - {edu.institution}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <button onClick={handleSubmit} className="btn-success" style={{ flex: 1, minWidth: '240px' }}>
                    💾 Secure Portfolio Data
                </button>

                <button
                    onClick={handlePublish}
                    disabled={!response || !response.data || response.data.completionPercentage < 100}
                    className="btn-primary"
                    style={{
                        flex: 1,
                        minWidth: '240px',
                        opacity: (!response || !response.data || response.data.completionPercentage < 100) ? 0.3 : 1
                    }}
                    title={(!response || !response.data || response.data.completionPercentage < 100) ? 'Reach 100% completion to unlock' : 'Launch your portfolio'}
                >
                    🚀 Deploy to Global Network
                </button>
            </div>

            {/* Response Display */}
            {response && response.success && (
                <div className={response.data.completionPercentage === 100 ? 'status-complete status-box' : 'status-incomplete status-box'}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {response.data.completionPercentage === 100 ? '✨' : '🚧'}
                        <span>Readiness Analytics</span>
                    </h3>

                    <div className="progress-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${response.data.completionPercentage}%` }}
                        ></div>
                    </div>

                    <div style={{ fontSize: '3rem', fontWeight: '900', color: 'white', textShadow: '0 0 20px var(--solar-gold-glow)' }}>
                        {response.data.completionPercentage}%
                    </div>

                    {response.data.completionPercentage === 100 ? (
                        <div style={{ marginTop: '16px' }}>
                            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
                                ✅ System Optimized
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>Your digital presence has reached peak maturity. You are cleared for global deployment.</p>
                        </div>
                    ) : (
                        <div style={{ marginTop: '16px' }}>
                            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--solar-gold)', marginBottom: '8px' }}>
                                📋 Evolution in Progress
                            </p>
                            <p style={{ color: 'var(--text-secondary)' }}>The algorithm requires a few more details to reach 100% integrity. Complete all modules to unlock deployment.</p>
                        </div>
                    )}

                    <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'inline-block' }}>
                        <span style={{ fontWeight: '700', color: response.data.isPublished ? '#10b981' : 'var(--text-muted)' }}>
                            Network Visibility: {response.data.isPublished ? 'ACTIVE (Live)' : 'DORMANT (Hidden)'}
                        </span>
                    </div>
                </div>
            )}

            {response && !response.success && (
                <div className="status-box" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                    <p style={{ color: '#fb7185', fontWeight: '700' }}>
                        ❌ Extraction Failure: {response.error}
                    </p>
                </div>
            )}
        </div>
    );
}

export default PortfolioForm;
