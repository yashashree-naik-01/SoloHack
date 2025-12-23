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
        <div className="card">
            <h2>📝 Create Your Portfolio</h2>

            {/* Basic Info */}
            <div className="section-header">
                <h3>Basic Information</h3>
            </div>

            <div className="form-group">
                <label>👤 Username (required) *</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                />
            </div>

            <div className="form-group">
                <label>✍️ About Me</label>
                <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Tell us about yourself..."
                />
            </div>

            <div className="form-group">
                <label>💡 Skills (comma-separated)</label>
                <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, Python, MongoDB"
                />
            </div>

            {/* Projects Section */}
            <div className="section-header" style={{ marginTop: '30px' }}>
                <h3>🚀 Projects</h3>
            </div>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <div className="form-group">
                    <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Project Title"
                    />
                </div>

                <div className="form-group">
                    <textarea
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Project Description"
                        style={{ minHeight: '80px' }}
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        value={projectTech}
                        onChange={(e) => setProjectTech(e.target.value)}
                        placeholder="Technologies used (comma-separated)"
                    />
                </div>

                <button onClick={addProject} className="btn-secondary">
                    ➕ Add Project
                </button>

                {projects.length > 0 && (
                    <div className="item-list">
                        <p style={{ fontWeight: '600', marginBottom: '10px' }}>
                            Added: {projects.length} project{projects.length > 1 ? 's' : ''}
                        </p>
                        {projects.map((proj, index) => (
                            <div key={index} className="item">
                                <span style={{ fontWeight: '600' }}>📦</span>
                                {proj.title}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Education Section */}
            <div className="section-header">
                <h3>🎓 Education</h3>
            </div>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                <div className="form-group">
                    <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="Institution Name"
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        placeholder="Degree (e.g., B.Tech in Computer Science)"
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="Year (e.g., 2024)"
                    />
                </div>

                <button onClick={addEducation} className="btn-secondary">
                    ➕ Add Education
                </button>

                {education.length > 0 && (
                    <div className="item-list">
                        <p style={{ fontWeight: '600', marginBottom: '10px' }}>
                            Added: {education.length} education entr{education.length > 1 ? 'ies' : 'y'}
                        </p>
                        {education.map((edu, index) => (
                            <div key={index} className="item">
                                <span style={{ fontWeight: '600' }}>🏫</span>
                                {edu.degree} - {edu.institution}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <button onClick={handleSubmit} className="btn-success" style={{ flex: 1, minWidth: '200px' }}>
                    💾 Save Portfolio
                </button>

                <button
                    onClick={handlePublish}
                    disabled={!response || !response.data || response.data.completionPercentage < 100}
                    className="btn-primary"
                    style={{
                        flex: 1,
                        minWidth: '200px',
                        opacity: (!response || !response.data || response.data.completionPercentage < 100) ? 0.5 : 1
                    }}
                    title={(!response || !response.data || response.data.completionPercentage < 100) ? 'Complete all sections to enable publish' : 'Publish your portfolio'}
                >
                    🚀 Publish Portfolio
                </button>
            </div>

            {/* Response Display */}
            {response && response.success && (
                <div className={response.data.completionPercentage === 100 ? 'status-complete status-box' : 'status-incomplete status-box'}>
                    <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {response.data.completionPercentage === 100 ? '🎉' : '⚠️'}
                        <span>Portfolio Status</span>
                    </h3>

                    <div className="progress-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${response.data.completionPercentage}%` }}
                        ></div>
                    </div>

                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>
                        {response.data.completionPercentage}%
                    </div>

                    {response.data.completionPercentage === 100 ? (
                        <div>
                            <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>
                                ✅ Portfolio Complete!
                            </p>
                            <p>Your portfolio is ready to publish matching our high quality standards. Click "Publish Portfolio" above.</p>
                        </div>
                    ) : (
                        <div>
                            <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>
                                📋 Work in Progress
                            </p>
                            <p>Just a few more steps! Complete all sections to unlock the publishing feature.</p>
                        </div>
                    )}

                    <p style={{ marginTop: '15px', fontWeight: '600', opacity: 0.8 }}>
                        Public Visibility: {response.data.isPublished ? '✅ Live' : '❌ Hidden'}
                    </p>
                </div>
            )}

            {response && !response.success && (
                <div className="status-error status-box">
                    <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                        ❌ Error: {response.error}
                    </p>
                </div>
            )}
        </div>
    );
}

export default PortfolioForm;
