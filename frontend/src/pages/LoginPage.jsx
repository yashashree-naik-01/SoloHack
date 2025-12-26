import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function LoginPage() {
    const [email, setEmail] = useState(''); // Changed from username
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }) // Send email
            });
            const data = await res.json();

            if (data.success) {
                // Store Token
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username); // Store username for routing
                alert('✅ Login Successful!');
                navigate('/create'); // Redirect to Dashboard
            } else {
                alert('❌ ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Login failed');
        }
    };

    return (
        <div className="form-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🔐 Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button className="btn-primary" style={{ width: '100%' }}>Login</button>
                    <p style={{ marginTop: '15px', textAlign: 'center' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
