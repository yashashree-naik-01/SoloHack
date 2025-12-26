import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import LivePortfolioPreview from '../components/LivePortfolioPreview';
import TemplateSelector from '../components/TemplateSelector';

function PreviewPage() {
    const [username, setUsername] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [portfolioData, setPortfolioData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPublishing, setIsPublishing] = useState(false);

    // Fetch portfolio data when username changes
    const fetchPortfolioData = async () => {
        if (!username) {
            setPortfolioData(null);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/portfolio/preview/${username}`);
            const data = await res.json();

            if (data.success) {
                setPortfolioData(data.data);
                // Set template if already selected in portfolio
                if (data.data.selectedTemplate) {
                    setSelectedTemplate(data.data.selectedTemplate);
                } else {
                    setSelectedTemplate(null); // Reset if no template
                }
            } else {
                setError(data.error || 'Portfolio not found');
                setPortfolioData(null);
            }
        } catch (err) {
            setError('Failed to fetch portfolio. Make sure backend is running.');
            setPortfolioData(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle publish action
    const handlePublish = async () => {
        if (!selectedTemplate) {
            alert('⚠️ Please select a template before publishing!');
            return;
        }

        setIsPublishing(true);

        try {
            // Save the selected template with existing portfolio data
            const saveRes = await fetch(`${API_BASE_URL}/api/portfolio/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    about: portfolioData.about,
                    skills: portfolioData.skills,
                    projects: portfolioData.projects,
                    education: portfolioData.education,
                    selectedTemplate
                })
            });

            const saveData = await saveRes.json();

            if (!saveData.success) {
                alert('❌ Failed to save template: ' + (saveData.error || 'Unknown error'));
                setIsPublishing(false);
                return;
            }

            // Then publish
            const pubRes = await fetch(`${API_BASE_URL}/api/portfolio/publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });

            const pubData = await pubRes.json();

            if (pubData.success) {
                alert('🎉 Portfolio published successfully!');
                // Update local state to reflect published status
                setPortfolioData(prev => ({ ...prev, isPublished: true }));
            } else {
                alert('❌ ' + (pubData.error || pubData.message || 'Failed to publish'));
            }
        } catch (error) {
            alert('❌ Error: ' + error.message);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="App">
            <div className="card glass">
                <h2>Portfolio Visualizer</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', textAlign: 'center' }}>
                    Preview your completed portfolio with professional templates.
                </p>

                <div className="form-group" style={{ maxWidth: '500px', margin: '0 auto 40px' }}>
                    <label>Enter Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchPortfolioData()}
                        placeholder="e.g., johndoe"
                    />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <button
                        onClick={fetchPortfolioData}
                        disabled={!username || loading}
                        className="btn-primary"
                        style={{
                            minWidth: '200px',
                            opacity: (!username || loading) ? 0.5 : 1
                        }}
                    >
                        {loading ? '⏳ Loading...' : '🔍 Load Preview'}
                    </button>
                </div>

                {loading && (
                    <div className="glass-inner-section" style={{ textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Loading portfolio data...</p>
                    </div>
                )}

                {error && (
                    <div className="status-box" style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
                        <p style={{ color: '#fb7185', fontWeight: '700' }}>
                            ❌ {error}
                        </p>
                    </div>
                )}

                {portfolioData && !loading && (
                    <>
                        {portfolioData.completionPercentage === 100 ? (
                            <div style={{ animation: 'fadeInUp 0.8s ease-out' }}>
                                {/* Completion Status */}
                                <div className="status-box status-complete" style={{ marginBottom: '40px' }}>
                                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                        ✨ <span>Portfolio Complete & Ready</span>
                                    </h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                        Your portfolio is 100% complete. Select a template and publish!
                                    </p>
                                    {portfolioData.isPublished && (
                                        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                                            <span style={{ fontWeight: '700', color: '#10b981' }}>
                                                ✅ Status: PUBLISHED (Live at /portfolio/{username})
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Template Selection */}
                                <div className="section-header" style={{ marginBottom: '24px' }}>
                                    <h3>Select Your Template</h3>
                                </div>

                                <TemplateSelector
                                    selectedTemplate={selectedTemplate}
                                    onTemplateChange={setSelectedTemplate}
                                />

                                {/* Publish Button */}
                                <div style={{ marginTop: '40px', marginBottom: '40px', textAlign: 'center' }}>
                                    {!selectedTemplate && (
                                        <p style={{ color: 'var(--warning)', marginBottom: '16px', fontSize: '1.05rem' }}>
                                            ⚠️ Please select a template before publishing
                                        </p>
                                    )}

                                    <button
                                        onClick={handlePublish}
                                        disabled={!selectedTemplate || isPublishing || portfolioData.isPublished}
                                        className="btn-primary"
                                        style={{
                                            opacity: (!selectedTemplate || isPublishing || portfolioData.isPublished) ? 0.4 : 1,
                                            minWidth: '300px',
                                            fontSize: '1.1rem',
                                            padding: '18px 40px'
                                        }}
                                        title={
                                            portfolioData.isPublished ? 'Portfolio already published' :
                                                !selectedTemplate ? 'Select a template first' :
                                                    'Publish your portfolio'
                                        }
                                    >
                                        {isPublishing ? '⏳ Publishing...' :
                                            portfolioData.isPublished ? '✅ Already Published' :
                                                '🚀 Publish Portfolio'}
                                    </button>
                                </div>

                                {/* Live Preview */}
                                <div className="section-header" style={{ marginBottom: '40px' }}>
                                    <h3>Live Preview</h3>
                                </div>

                                <LivePortfolioPreview
                                    username={username}
                                    portfolioData={portfolioData}
                                    template={selectedTemplate || 'minimal'}
                                />
                            </div>
                        ) : (
                            <div className="status-box status-incomplete">
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                    🚧 <span>Portfolio Incomplete</span>
                                </h3>

                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--warning)', margin: '24px 0' }}>
                                    {portfolioData.completionPercentage}%
                                </div>

                                <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                    Your portfolio must be 100% complete to access the preview and publish.
                                </p>

                                <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                                    👉 Go to the <strong>Create</strong> tab and complete all required sections:
                                </p>

                                <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '20px auto', color: 'var(--text-secondary)' }}>
                                    <li>✍️ About section</li>
                                    <li>💡 Skills</li>
                                    <li>🚀 At least one Project</li>
                                    <li>🎓 At least one Education entry</li>
                                </ul>
                            </div>
                        )}
                    </>
                )}

                {!username && !loading && !error && !portfolioData && (
                    <div className="glass-inner-section" style={{ textAlign: 'center', opacity: 0.6 }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Enter a username and click "Load Preview" to view your portfolio...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PreviewPage;
