import { useState } from 'react';
import { API_BASE_URL } from '../config';

function PublicPortfolioViewer() {
    const [username, setUsername] = useState('');

    const handleViewPortfolio = () => {
        if (!username) {
            alert('⚠️ Please enter a target identity');
            return;
        }

        // We should open the frontend route instead of backend API for better UX
        const url = `${window.location.origin}/portfolio/${username}`;
        window.open(url, '_blank');
    };

    return (
        <div className="card glass">
            <h2>Global Discovery</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', textAlign: 'center' }}>
                Search the decentralized network of published student portfolios.
            </p>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px', margin: '0 auto' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '300px', marginBottom: 0 }}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleViewPortfolio()}
                        placeholder="Search by username..."
                    />
                </div>

                <button
                    onClick={handleViewPortfolio}
                    className="btn-primary"
                >
                    Initialize Connection
                </button>
            </div>

            <div className="glass-inner-section" style={{ marginTop: '40px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--solar-gold)', fontWeight: '600', opacity: 0.8 }}>
                    💡 Intelligence: Portfolios manifest only after reaching 100% integrity and authorized deployment.
                </p>
            </div>
        </div>
    );
}

export default PublicPortfolioViewer;
