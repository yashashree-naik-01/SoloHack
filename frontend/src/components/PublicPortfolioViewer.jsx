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
            <h2>Explore Portfolios</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', textAlign: 'center' }}>
                Search for published student portfolios by their username.
            </p>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '700px', margin: '0 auto' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '300px', marginBottom: 0 }}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleViewPortfolio()}
                        placeholder="Enter username to view..."
                    />
                </div>

                <button
                    onClick={handleViewPortfolio}
                    className="btn-primary"
                >
                    View Portfolio
                </button>

                <button
                    onClick={async () => {
                        if (!username) return alert('⚠️ Please enter a username to delete');
                        if (!confirm(`Are you sure you want to delete the portfolio for "${username}"? This cannot be undone.`)) return;

                        try {
                            const res = await fetch(`${API_BASE_URL}/api/portfolio/delete`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ username })
                            });
                            const data = await res.json();
                            if (res.ok) {
                                alert('✅ Portfolio Deleted Successfully');
                                setUsername('');
                            } else {
                                alert('❌ Failed to delete: ' + (data.error || 'Unknown error'));
                            }
                        } catch (err) {
                            console.error(err);
                            alert('❌ Error connecting to server');
                        }
                    }}
                    className="btn-secondary"
                    style={{ backgroundColor: '#ff4444', color: 'white', border: 'none' }}
                >
                    Delete Portfolio
                </button>
            </div>

            <div className="glass-inner-section" style={{ marginTop: '40px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.95rem', color: 'var(--primary)', fontStyle: 'italic', opacity: 0.8 }}>
                    💡 Note: Portfolios are only visible after they have been 100% completed and published.
                </p>
            </div>
        </div>
    );
}

export default PublicPortfolioViewer;
