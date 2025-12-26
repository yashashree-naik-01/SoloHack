import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function SignupPage() {
    const [fullName, setFullName] = useState(''); // Changed from username
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }) // Send fullName
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                alert(`✅ Account Created! Your unique username is: ${data.username}`); // Inform user of generated username
                navigate('/create');
            } else {
                alert('❌ ' + data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Signup failed');
        }
    };

    return (
        <div className="form-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="e.g. John Doe" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button className="btn-primary" style={{ width: '100%' }}>Create Account</button>
                    <p style={{ marginTop: '15px', textAlign: 'center' }}>
                        Already a member? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;
