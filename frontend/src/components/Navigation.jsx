import { Link, useLocation } from 'react-router-dom';

function Navigation() {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/create', label: 'Create', icon: '✍️' },
        { path: '/preview', label: 'Preview', icon: '👁️' },
        { path: '/public', label: 'Explore', icon: '🔍' }
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
            </div>
        </nav>
    );
}

export default Navigation;
