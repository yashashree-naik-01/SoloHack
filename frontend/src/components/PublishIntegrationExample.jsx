import { useState } from 'react';
import { API_BASE_URL } from '../config';
import PublishSection from './PublishSection';

// Example: How to integrate PublishSection with your PortfolioForm
function PortfolioFormWithPublish() {
    const [username, setUsername] = useState('');
    const [about, setAbout] = useState('');
    const [skills, setSkills] = useState('');
    const [projects, setProjects] = useState([]);
    const [education, setEducation] = useState([]);
    const [response, setResponse] = useState(null);

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
            setResponse(data);

            if (data.success) {
                alert(`✅ Portfolio saved! Completion: ${data.data.completionPercentage}%`);
            }
        } catch (error) {
            alert('❌ Error: ' + error.message);
        }
    };

    const handlePublishSuccess = (publishedData) => {
        // Update local state with published data
        setResponse(prev => ({
            ...prev,
            data: publishedData
        }));
    };

    return (
        <div className="card">
            <h2>📝 Create Your Portfolio</h2>

            {/* Your form fields here */}
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            {/* ... more form fields ... */}

            <button onClick={handleSave} className="btn-success">
                💾 Save Portfolio
            </button>

            {/* Publish Section - Shows after save */}
            <PublishSection
                response={response}
                username={username}
                onPublishSuccess={handlePublishSuccess}
            />
        </div>
    );
}

export default PortfolioFormWithPublish;
