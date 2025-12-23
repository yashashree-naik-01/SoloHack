import { useState } from 'react';
import { API_BASE_URL } from '../config';

function PublicPortfolioViewer() {
    const [username, setUsername] = useState('');

    const handleViewPortfolio = () => {
        if (!username) {
            alert('⚠️ Please enter a username');
            return;
        }

        const url = `${API_BASE_URL}/api/portfolio/${username}`;
        window.open(url, '_blank');
    };

    return (
        <div className="card tab-content">
            <h2>🔍 Explore Portfolios</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                Search for a student's public profile and view their achievements.
            </p>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleViewPortfolio()}
                        placeholder="Enter username (e.g., student123)"
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            fontSize: '1rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '14px',
                            background: 'white'
                        }}
                    />
                </div>

                <button
                    onClick={handleViewPortfolio}
                    className="btn-primary"
                    style={{
                        padding: '16px 36px',
                        fontSize: '1rem'
                    }}
                >
                    View Portfolio
                </button>
            </div>

            <div style={{
                marginTop: '30px',
                padding: '20px',
                background: 'rgba(79, 70, 229, 0.05)',
                borderRadius: '16px',
                border: '1px dashed var(--primary)'
            }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '500' }}>
                    💡 Tip: Portfolios are only visible if the student has reached 100% completion and hit "Publish".
                </p>
            </div>
        </div>
    );
}

export default PublicPortfolioViewer;
