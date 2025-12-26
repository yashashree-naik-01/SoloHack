import { useState } from 'react';
import LivePortfolioPreview from './components/LivePortfolioPreview';

// Example usage of LivePortfolioPreview component
function PreviewDemo() {
    const [username, setUsername] = useState('');

    // Example 1: Fetching from backend using username
    const handleFetch = () => {
        // The component will automatically fetch when username changes
    };

    // Example 2: Using with local data
    const sampleData = {
        username: 'johndoe',
        about: 'I am a passionate full-stack developer with experience in building modern web applications.',
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Python'],
        projects: [
            {
                title: 'E-commerce Platform',
                description: 'Built a full-featured online shopping platform with cart and payment integration.',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
            }
        ],
        education: [
            {
                institution: 'XYZ University',
                degree: 'B.Tech in Computer Science',
                year: '2024'
            }
        ],
        completionPercentage: 100
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Live Portfolio Preview Demo</h1>

            {/* Method 1: Fetch from backend */}
            <div style={{ marginBottom: '40px' }}>
                <h2>Method 1: Fetch from Backend</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    style={{ padding: '10px', marginRight: '10px' }}
                />
                <LivePortfolioPreview username={username} />
            </div>

            {/* Method 2: Display local data */}
            <div>
                <h2>Method 2: Display Local Data</h2>
                <LivePortfolioPreview portfolioData={sampleData} />
            </div>
        </div>
    );
}

export default PreviewDemo;
