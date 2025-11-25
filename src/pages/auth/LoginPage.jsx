import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../assets/styles/AuthPages.css';


export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { ok, error: msg } = await login({ email, password });
            if (!ok) {
                setError(msg || 'Access denied by the Administratum');
            } else {
                // Redirect to dashboard
                window.location.href = '/dashboard';
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Authentication failed. The Machine Spirit rejects your credentials.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">{" "}
                    <div className="skull-header">☠</div>
                    <h1 className="auth-title">VAULT ACCESS PROTOCOL</h1>
                    <p className="auth-subtitle">
                        Enter your credentials to access your Imperial vault
                    </p>

                    <div className="purity-seal-small">
                        ⚜ SECURE AUTHENTICATION ⚜
                    </div>

                    <form onSubmit={submit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                VOX-MAIL ADDRESS
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="citizen@imperium.terra"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                SECURITY CIPHER
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="form-input"
                                placeholder="Enter your cipher"
                                required
                            />
                            <div style={{ textAlign: 'right', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="auth-link"
                                    style={{ fontSize: '13px' }}
                                >
                                    Forgot your cipher?
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading ? 'AUTHENTICATING...' : 'ACCESS VAULT'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-link-text">
                            Not yet enlisted?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="auth-link"
                            >
                                Join the Imperium
                            </button>
                        </p>
                    </div>

                    <div className="imperial-decree-small">
                        "The Emperor protects those who protect their wealth"
                    </div>
                </div>
            </div>
        </div>
    );
}