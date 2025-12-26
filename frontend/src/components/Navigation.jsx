import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Check auth state

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        alert('Logged out successfully');
        navigate('/'); // Redirect to Home
    };

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/create', label: 'Create', icon: '✍️' },
        { path: '/preview', label: 'Preview', icon: '👁️' },
        { path: '/public', label: 'View Published Portfolio', icon: '🔍' }
    ];

    return (
        <nav className="main-navigation">
            <div className="nav-brand">
                <Link to="/">🎓 Portfolio Builder</Link>
            </div>
            <div className="nav-links">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </Link>
                ))}

                {/* Auth Buttons */}
                {token ? (
                    <button onClick={handleLogout} className="nav-link" style={{ color: 'var(--danger)', fontWeight: 'bold' }}>
                        <span className="nav-icon">🚪</span>
                        <span className="nav-label">Logout</span>
                    </button>
                ) : (
                    <Link to="/login" className="nav-link">
                        <span className="nav-icon">🔐</span>
                        <span className="nav-label">Login</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navigation;
