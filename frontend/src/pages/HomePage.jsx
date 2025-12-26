import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="App">
            <div className="app-header">
                <h1>Professional Student Portfolios</h1>
                <p>Build, preview, and share your personal portfolio with ease and professionalism.</p>
            </div>

            <div className="home-content">
                <div className="feature-cards">
                    <div className="feature-card glass">
                        <div className="feature-icon">📝</div>
                        <h3>Create Your Identity</h3>
                        <p>Fill in your details or upload a resume to generate a professional portfolio in minutes.</p>
                        <Link to="/create" className="btn-primary card-button">
                            Start Creating →
                        </Link>
                    </div>

                    <div className="feature-card glass">
                        <div className="feature-icon">🎨</div>
                        <h3>Modern Templates</h3>
                        <p>Choose from professional templates designed to showcase your skills and projects.</p>
                        <Link to="/preview" className="btn-secondary card-button">
                            View Templates →
                        </Link>
                    </div>

                    <div className="feature-card glass">
                        <div className="feature-icon">🚀</div>
                        <h3>Quick Publishing</h3>
                        <p>Publish your portfolio to a unique live URL and share it with employers instantly.</p>
                        <Link to="/public" className="btn-secondary card-button">
                            Explore Portfolios →
                        </Link>
                    </div>
                </div>

                <div className="features-list">
                    <h3>Everything You Need</h3>
                    <ul>
                        <li>
                            <span className="feature-stat">📄</span>
                            <span>Resume Data Extraction</span>
                        </li>
                        <li>
                            <span className="feature-stat">✨</span>
                            <span>Professional Visual Styles</span>
                        </li>
                        <li>
                            <span className="feature-stat">📊</span>
                            <span>Completion Tracking</span>
                        </li>
                        <li>
                            <span className="feature-stat">🌐</span>
                            <span>Live Hosting & Sharing</span>
                        </li>
                        <li>
                            <span className="feature-stat">📱</span>
                            <span>Fully Responsive Designs</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
