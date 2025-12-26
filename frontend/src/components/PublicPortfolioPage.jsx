import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import LivePortfolioPreview from './LivePortfolioPreview';

function PublicPortfolioPage({ username }) {
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (username) {
            fetchPortfolio();
        }
    }, [username]);

    const fetchPortfolio = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/portfolio/${username}`);
            const result = await res.json();

            if (result.success && result.data.isPublished !== false) {
                setPortfolio(result.data);
            } else if (result.success && result.data.isPublished === false) {
                setError('not_published');
            } else {
                setError('not_found');
            }
        } catch (err) {
            setError('network_error');
        } finally {
            setLoading(false);
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="public-portfolio-page">
                <div className="status-container loading">
                    <div className="spinner">⏳</div>
                    <h2>Loading Portfolio...</h2>
                    <p>Please wait while we fetch {username}'s portfolio</p>
                </div>
            </div>
        );
    }

    // Error States
    if (error === 'not_published') {
        return (
            <div className="public-portfolio-page">
                <div className="status-container not-published">
                    <div className="status-icon">🔒</div>
                    <h2>Portfolio Not Published</h2>
                    <p>This portfolio is still being worked on and hasn't been published yet.</p>
                    <p className="hint">The owner needs to complete all sections and hit the "Publish" button.</p>
                </div>
            </div>
        );
    }

    if (error === 'not_found') {
        return (
            <div className="public-portfolio-page">
                <div className="status-container not-found">
                    <div className="status-icon">❌</div>
                    <h2>Portfolio Not Found</h2>
                    <p>We couldn't find a portfolio for username: <strong>{username}</strong></p>
                    <p className="hint">Please check the URL and try again.</p>
                </div>
            </div>
        );
    }

    if (error === 'network_error') {
        return (
            <div className="public-portfolio-page">
                <div className="status-container error">
                    <div className="status-icon">⚠️</div>
                    <h2>Connection Error</h2>
                    <p>Unable to connect to the server. Please try again later.</p>
                    <button
                        onClick={fetchPortfolio}
                        className="btn-primary"
                        style={{ marginTop: '20px', padding: '12px 24px' }}
                    >
                        🔄 Retry
                    </button>
                </div>
            </div>
        );
    }

    // Success - Show Portfolio (Clean View)
    return (
        <div className="public-portfolio-page" style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh' }}>
            {/* Header Removed as per user request */}

            <LivePortfolioPreview
                portfolioData={portfolio}
                template={portfolio.selectedTemplate || 'minimal'}
            />

            {/* Footer Removed as per user request */}
        </div>
    );
}

export default PublicPortfolioPage;
