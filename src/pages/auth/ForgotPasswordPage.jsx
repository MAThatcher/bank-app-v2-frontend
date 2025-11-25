import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordApi } from '../../api/authApi';
import '../../assets/styles/AuthPages.css';
import aquilaImage from '../../assets/images/40k_imperial_aquila__transparent__by_fuguestock_d91enql-fullview.png';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await forgotPasswordApi(email);
            setSuccess(true);
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(
                err.response?.data?.message || 
                'Unable to process request. The Administratum could not locate your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-card">
                        <img src={aquilaImage} alt="Imperial Aquila" className="brand-aquila-img" />
                        <h1 className="auth-title" style={{ color: '#00ff00' }}>
                            ✓ REQUEST PROCESSED
                        </h1>
                        <div className="purity-seal-small">
                            ⚜ CIPHER RESET AUTHORIZED ⚜
                        </div>
                        
                        <div className="verification-status success">
                            <div className="success-icon">⚔</div>
                            <p className="success-message">
                                The Administratum has dispatched cipher reset instructions to your vox-mail.
                            </p>
                            <p style={{ color: '#c0c0c0', fontSize: '14px', marginTop: '20px' }}>
                                Check your inbox and follow the secure link to establish a new security cipher.
                            </p>
                            <div className="imperial-decree-small" style={{ margin: '30px 0' }}>
                                "Guard your credentials as you would guard your life. The Emperor protects the vigilant."
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="auth-button"
                            style={{ marginTop: '20px' }}
                        >
                            RETURN TO LOGIN
                        </button>

                        <div className="auth-footer" style={{ marginTop: '40px' }}>
                            <p className="auth-link-text" style={{ fontSize: '12px', color: '#888' }}>
                                The authorization link expires in 15 minutes by Imperial Standard Time
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <img src={aquilaImage} alt="Imperial Aquila" className="brand-aquila-img" />
                    <h1 className="auth-title">CIPHER RECOVERY PROTOCOL</h1>
                    <p className="auth-subtitle">
                        Request authorization to reset your security cipher
                    </p>

                    <div className="purity-seal-small">
                        ⚔ SECURITY DIVISION ⚔
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
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-input"
                                placeholder="citizen@imperium.terra"
                                required
                            />
                            <small className="form-hint">
                                Enter the vox-mail address associated with your Vault-Throne
                            </small>
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
                            {loading ? 'PROCESSING REQUEST...' : 'REQUEST CIPHER RESET'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-link-text">
                            Remember your cipher?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="auth-link"
                            >
                                Return to login
                            </button>
                        </p>
                    </div>

                    <div className="imperial-decree-small">
                        "The Administratum serves all loyal citizens of the Imperium"
                    </div>
                </div>
            </div>
        </div>
    );
}
