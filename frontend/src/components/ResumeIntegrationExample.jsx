import { useState } from 'react';
import ResumeUpload from './ResumeUpload';
import { API_BASE_URL } from '../config';

// Example: Complete integration of Resume Upload with Portfolio Form
function PortfolioFormWithResume() {
    const [username, setUsername] = useState('');
    const [about, setAbout] = useState('');
    const [skills, setSkills] = useState('');
    const [projects, setProjects] = useState([]);
    const [education, setEducation] = useState([]);
    const [dataSource, setDataSource] = useState(null); // 'resume' or 'manual'

    // Handle extracted data from resume
    const handleResumeData = (extracted) => {
        // Auto-fill form fields with extracted data
        if (extracted.about) {
            setAbout(extracted.about);
        }

        if (extracted.skills && extracted.skills.length > 0) {
            setSkills(extracted.skills.join(', '));
        }

        if (extracted.projects && extracted.projects.length > 0) {
            setProjects(extracted.projects);
        }

        if (extracted.education && extracted.education.length > 0) {
            setEducation(extracted.education);
        }

        setDataSource('resume');

        // Show success notification
        const filledSections = [
            extracted.about && 'About',
            extracted.skills?.length > 0 && 'Skills',
            extracted.projects?.length > 0 && 'Projects',
            extracted.education?.length > 0 && 'Education'
        ].filter(Boolean).join(', ');

        alert(`✅ Auto-filled: ${filledSections}\n\n📝 Please review and complete any missing sections.`);
    };

    const handleSave = async () => {
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

            if (data.success) {
                alert(`✅ Portfolio saved! Completion: ${data.data.completionPercentage}%`);
            }
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    return (
        <div className="card">
            <h2>📝 Create Your Portfolio</h2>

            {/* Resume Upload Section */}
            <ResumeUpload onDataExtracted={handleResumeData} />

            {dataSource === 'resume' && (
                <div className="data-source-badge">
                    ✨ Fields auto-filled from resume. Review and edit as needed.
                </div>
            )}

            {/* Basic Info */}
            <div className="form-group">
                <label>👤 Username (required)</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                />
            </div>

            <div className="form-group">
                <label>✍️ About Me {about && dataSource === 'resume' && '(Auto-filled)'}</label>
                <textarea
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className={dataSource === 'resume' && about ? 'auto-filled' : ''}
                />
            </div>

            <div className="form-group">
                <label>💡 Skills {skills && dataSource === 'resume' && '(Auto-filled)'}</label>
                <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, Node.js, Python"
                    className={dataSource === 'resume' && skills ? 'auto-filled' : ''}
                />
            </div>

            {/* Projects Display */}
            {projects.length > 0 && (
                <div className="form-group">
                    <label>🚀 Projects {dataSource === 'resume' && '(Auto-filled)'}</label>
                    <div className="item-list">
                        {projects.map((proj, idx) => (
                            <div key={idx} className="item auto-filled">
                                <span>📦 {proj.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education Display */}
            {education.length > 0 && (
                <div className="form-group">
                    <label>🎓 Education {dataSource === 'resume' && '(Auto-filled)'}</label>
                    <div className="item-list">
                        {education.map((edu, idx) => (
                            <div key={idx} className="item auto-filled">
                                <span>🏫 {edu.degree} - {edu.institution}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Save Button */}
            <button onClick={handleSave} className="btn-success" style={{ width: '100%', marginTop: '20px' }}>
                💾 Save Portfolio
            </button>
        </div>
    );
}

export default PortfolioFormWithResume;
