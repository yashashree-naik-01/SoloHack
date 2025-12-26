import { useState } from 'react';
import TemplateSelector from './components/TemplateSelector';
import LivePortfolioPreview from './components/LivePortfolioPreview';

// Example: Complete Template Selection Flow
function TemplateDemo() {
    const [selectedTemplate, setSelectedTemplate] = useState('minimal');

    // Sample portfolio data - same data will be used for all templates
    const portfolioData = {
        username: 'johndoe',
        about: 'I am a passionate full-stack developer with 3+ years of experience building scalable web applications. I love solving complex problems and creating user-friendly interfaces.',
        skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Python', 'Express', 'Git', 'Docker'],
        projects: [
            {
                title: 'E-commerce Platform',
                description: 'Built a full-featured online shopping platform with cart functionality, payment integration, and admin dashboard. Handles 1000+ daily users.',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux']
            },
            {
                title: 'Task Management App',
                description: 'Real-time collaborative task manager with drag-and-drop interface, team collaboration, and progress tracking features.',
                technologies: ['React', 'Firebase', 'Material-UI', 'Socket.io']
            },
            {
                title: 'AI Chatbot',
                description: 'Developed an intelligent chatbot using natural language processing to handle customer queries and provide automated support.',
                technologies: ['Python', 'TensorFlow', 'Flask', 'NLP']
            }
        ],
        education: [
            {
                institution: 'XYZ University',
                degree: 'B.Tech in Computer Science',
                year: '2020 - 2024'
            },
            {
                institution: 'ABC High School',
                degree: 'High School Diploma',
                year: '2018 - 2020'
            }
        ],
        completionPercentage: 100
    };

    return (
        <div className="App" style={{ padding: '40px 20px' }}>
            <div className="app-header">
                <h1>🎨 Template Selection Demo</h1>
                <p>Choose a template and see your portfolio transform!</p>
            </div>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Template Selector */}
                <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onTemplateChange={setSelectedTemplate}
                />

                {/* Live Preview with Selected Template */}
                <div style={{ marginTop: '40px' }}>
                    <h2 style={{
                        color: 'white',
                        marginBottom: '20px',
                        fontSize: '1.8rem',
                        textAlign: 'center'
                    }}>
                        📱 Live Preview - {selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Template
                    </h2>

                    <LivePortfolioPreview
                        portfolioData={portfolioData}
                        template={selectedTemplate}
                    />
                </div>
            </div>
        </div>
    );
}

export default TemplateDemo;
