import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import PublicPortfolioPage from './components/PublicPortfolioPage';

// Simple router that reads username from URL
function Router() {
    // Check if URL is /portfolio/:username
    const path = window.location.pathname;
    const match = path.match(/^\/portfolio\/([^/]+)$/);

    if (match) {
        const username = match[1];
        return <PublicPortfolioPage username={username} />;
    }

    // Default - redirect to main app or show 404
    return (
        <div className="public-portfolio-page">
            <div className="status-container not-found">
                <div className="status-icon">🏠</div>
                <h2>Welcome to Portfolio Builder</h2>
                <p>To view a portfolio, visit: <code>/portfolio/username</code></p>
                <p className="hint">For example: /portfolio/johndoe</p>
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router />
    </React.StrictMode>
);
