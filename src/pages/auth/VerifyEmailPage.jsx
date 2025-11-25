import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyEmailApi } from '../../api/usersApi';
import '../../assets/styles/AuthPages.css';
import aquilaImage from '../../assets/images/40k_imperial_aquila__transparent__by_fuguestock_d91enql-fullview.png';

export default function VerifyEmailPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('No verification token provided. Authorization denied.');
                return;
            }

            try {
                const response = await verifyEmailApi(token);
                setStatus('success');
                setMessage(response.data.message || 'Email successfully verified by the Administratum!');
            } catch (err) {
                setStatus('error');
                setMessage(
                    err.response?.data?.error || 
                    err.response?.data?.message || 
                    'Verification failed. The Administratum could not validate your credentials.'
                );
            }
        };

        verifyEmail();
    }, [token]);

    const handleContinue = () => {
        navigate('/login');
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <img src={aquilaImage} alt="Imperial Aquila" className="brand-aquila-img" />
                    
                    {status === 'verifying' && (
                        <>
                            <h1 className="auth-title">VERIFYING CREDENTIALS</h1>
                            <div className="purity-seal-small">
                                ⚜ PROCESSING AUTHORIZATION ⚜
                            </div>
                            <div className="verification-status">
                                <div className="spinner"></div>
                                <p style={{ color: '#c0c0c0', marginTop: '20px' }}>
                                    The Administratum is validating your identity...
                                </p>
                            </div>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <h1 className="auth-title" style={{ color: '#00ff00' }}>
                                ✓ VERIFICATION COMPLETE
                            </h1>
                            <div className="purity-seal-small">
                                ⚜ ADMINISTRATUM APPROVED ⚜
                            </div>
                            <div className="verification-status success">
                                <div className="success-icon">⚔</div>
                                <p className="success-message">{message}</p>
                                <div className="imperial-decree-small" style={{ margin: '30px 0' }}>
                                    "Your loyalty to the Emperor has been confirmed. You may now access your Vault-Throne."
                                </div>
                                <button
                                    onClick={handleContinue}
                                    className="auth-button"
                                    style={{ marginTop: '20px' }}
                                >
                                    PROCEED TO LOGIN
                                </button>
                            </div>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <h1 className="auth-title" style={{ color: '#ff4444' }}>
                                ⚠ VERIFICATION FAILED
                            </h1>
                            <div className="purity-seal-small" style={{ borderColor: '#ff4444', color: '#ff4444' }}>
                                ⚠ AUTHORIZATION DENIED ⚠
                            </div>
                            <div className="verification-status error">
                                <div className="error-icon">⚠</div>
                                <p className="error-message">{message}</p>
                                <div className="imperial-decree-small" style={{ margin: '30px 0', borderColor: '#ff4444' }}>
                                    "The Administratum requires valid credentials. Please ensure your verification link is correct and has not expired."
                                </div>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="auth-button"
                                        style={{ backgroundColor: '#555' }}
                                    >
                                        REGISTER AGAIN
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="auth-button"
                                    >
                                        RETURN TO LOGIN
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="auth-footer" style={{ marginTop: '40px' }}>
                        <p className="auth-link-text" style={{ fontSize: '12px', color: '#888' }}>
                            For the Emperor • Serving the Imperium since M41
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
