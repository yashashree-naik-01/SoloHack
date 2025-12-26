import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="App">
            <div className="app-header">
                <h1>Craft Your Legacy</h1>
                <p>The elite student portfolio builder for the next generation of professionals.</p>
            </div>

            <div className="home-content">
                <div className="feature-cards">
                    <div className="feature-card glass">
                        <div className="feature-icon">✨</div>
                        <h3>Create Portfolio</h3>
                        <p>Build a world-class portfolio from scratch or leverage AI resume extraction.</p>
                        <Link to="/create" className="btn-primary card-button">
                            Start Building →
                        </Link>
                    </div>

                    <div className="feature-card glass">
                        <div className="feature-icon">💎</div>
                        <h3>Live Preview</h3>
                        <p>Experience your portfolio through three meticulously designed templates.</p>
                        <Link to="/preview" className="btn-secondary card-button">
                            Preview Designs →
                        </Link>
                    </div>

                    <div className="feature-card glass">
                        <div className="feature-icon">🌐</div>
                        <h3>View Your Portfolio</h3>
                        <p>Access your published portfolio and share it with the world.</p>
                        <Link to="/public" className="btn-secondary card-button">
                            View Published →
                        </Link>
                    </div>
                </div>

                <div className="features-list">
                    <h3>Premium Capabilities</h3>
                    <ul>
                        <li>
                            <span className="feature-stat">🤖</span>
                            <span>AI-Accelerated Data Extraction</span>
                        </li>
                        <li>
                            <span className="feature-stat">🎨</span>
                            <span>Three Bespoke Visual Identities</span>
                        </li>
                        <li>
                            <span className="feature-stat">⚡</span>
                            <span>Real-time Completion Analytics</span>
                        </li>
                        <li>
                            <span className="feature-stat">🚀</span>
                            <span>Instant Global Cloud Publishing</span>
                        </li>
                        <li>
                            <span className="feature-stat">🔗</span>
                            <span>Immutable Public Branding</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
