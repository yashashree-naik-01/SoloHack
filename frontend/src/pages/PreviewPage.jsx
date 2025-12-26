import { useState } from 'react';
import LivePortfolioPreview from '../components/LivePortfolioPreview';
import TemplateSelector from '../components/TemplateSelector';

function PreviewPage() {
    const [username, setUsername] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('minimal');

    return (
        <div className="App">
            <div className="card glass">
                <h2>Visualizer</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', textAlign: 'center' }}>
                    Project any digital identity onto our bespoke visual templates.
                </p>

                <div className="form-group" style={{ maxWidth: '500px', margin: '0 auto 40px' }}>
                    <label>Target Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g., alexsmith"
                    />
                </div>

                {username ? (
                    <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                        <TemplateSelector
                            selectedTemplate={selectedTemplate}
                            onTemplateChange={setSelectedTemplate}
                        />

                        <div className="section-header" style={{ marginBottom: '40px' }}>
                            <h3>Live Rendition</h3>
                        </div>

                        <LivePortfolioPreview
                            username={username}
                            template={selectedTemplate}
                        />
                    </div>
                ) : (
                    <div className="glass-inner-section" style={{ textAlign: 'center', opacity: 0.6 }}>
                        <p>Awaiting username input to initialize visualization sequence...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PreviewPage;
