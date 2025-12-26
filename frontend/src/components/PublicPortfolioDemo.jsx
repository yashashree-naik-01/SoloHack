import { useState } from 'react';
import PublicPortfolioPage from './components/PublicPortfolioPage';

// Demo showing different states of PublicPortfolioPage
function PublicPortfolioDemo() {
    const [testUsername, setTestUsername] = useState('johndoe');
    const [scenario, setScenario] = useState('success');

    const scenarios = [
        { id: 'success', label: '✅ Published Portfolio', username: 'johndoe' },
        { id: 'not-published', label: '🔒 Not Published', username: 'unpublished' },
        { id: 'not-found', label: '❌ Not Found', username: 'nonexistent123' },
    ];

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: 'white',
                padding: '30px',
                borderRadius: '16px',
                marginBottom: '20px'
            }}>
                <h1>🧪 Public Portfolio Page Demo</h1>
                <p>Test different scenarios:</p>

                {/* Test Scenarios */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                    {scenarios.map(s => (
                        <button
                            key={s.id}
                            onClick={() => {
                                setScenario(s.id);
                                setTestUsername(s.username);
                            }}
                            style={{
                                padding: '12px 20px',
                                borderRadius: '8px',
                                border: scenario === s.id ? '2px solid #4f46e5' : '2px solid #e5e7eb',
                                background: scenario === s.id ? '#ede9fe' : 'white',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Custom Username Input */}
                <div style={{ marginTop: '20px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                        Or test custom username:
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            value={testUsername}
                            onChange={(e) => setTestUsername(e.target.value)}
                            placeholder="Enter username"
                            style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '2px solid #e5e7eb',
                                flex: 1
                            }}
                        />
                        <button
                            onClick={() => setScenario('custom')}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '8px',
                                background: '#4f46e5',
                                color: 'white',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Test
                        </button>
                    </div>
                </div>

                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: '#f0f9ff',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                }}>
                    <strong>💡 Tip:</strong> In production, the username comes from URL params like <code>/portfolio/{testUsername}</code>
                </div>
            </div>

            {/* Render PublicPortfolioPage */}
            <PublicPortfolioPage username={testUsername} key={testUsername} />
        </div>
    );
}

export default PublicPortfolioDemo;
