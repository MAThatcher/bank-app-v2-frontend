import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '../../api/authApi';
import '../../assets/styles/AuthPages.css';
import aquilaImage from '../../assets/images/40k_imperial_aquila__transparent__by_fuguestock_d91enql-fullview.png';

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.password || !formData.confirmPassword) {
            setError('Both cipher fields are required by Imperial decree');
            return false;
        }

        if (formData.password.length < 8) {
            setError('New cipher must be at least 8 characters (Security Protocol 40K)');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Cipher verification failed - entries do not match');
            return false;
        }

        return true;
    };

    const submit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
            return;
        }

        if (!token) {
            setError('No authorization token provided. Access denied.');
            return;
        }

        setLoading(true);

        try {
            await resetPasswordApi(formData.password, token);
            setSuccess(true);
        } catch (err) {
            console.error('Reset password error:', err);
            setError(
                err.response?.data?.message || 
                'Cipher reset failed. The authorization token may be invalid or expired.'
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
                            ✓ CIPHER RESET COMPLETE
                        </h1>
                        <div className="purity-seal-small">
                            ⚜ SECURITY APPROVED ⚜
                        </div>
                        
                        <div className="verification-status success">
                            <div className="success-icon">⚔</div>
                            <p className="success-message">
                                Your new security cipher has been established and encrypted by the Mechanicus.
                            </p>
                            <p style={{ color: '#c0c0c0', fontSize: '14px', marginTop: '20px' }}>
                                You may now access your Vault-Throne with your new credentials.
                            </p>
                            <div className="imperial-decree-small" style={{ margin: '30px 0' }}>
                                "Vigilance is the price of security. May the Emperor guide your transactions."
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/login')}
                            className="auth-button"
                            style={{ marginTop: '20px' }}
                        >
                            PROCEED TO LOGIN
                        </button>

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

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <img src={aquilaImage} alt="Imperial Aquila" className="brand-aquila-img" />
                    <h1 className="auth-title">ESTABLISH NEW CIPHER</h1>
                    <p className="auth-subtitle">
                        Create a new security cipher for your Vault-Throne
                    </p>

                    <div className="purity-seal-small">
                        ⚔ AUTHORIZED CIPHER RESET ⚔
                    </div>

                    <form onSubmit={submit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                NEW SECURITY CIPHER
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Minimum 8 characters"
                                required
                            />
                            <small className="form-hint">
                                Must contain at least 8 characters (Mechanicus encryption standard)
                            </small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                CONFIRM NEW CIPHER
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Re-enter your cipher"
                                required
                            />
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
                            {loading ? 'ENCRYPTING CIPHER...' : 'ESTABLISH NEW CIPHER'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-link-text">
                            <button
                                onClick={() => navigate('/login')}
                                className="auth-link"
                            >
                                Return to login
                            </button>
                        </p>
                    </div>

                    <div className="imperial-decree-small">
                        "By changing your cipher, you reaffirm your oath to the Emperor"
                    </div>
                </div>
            </div>
        </div>
    );
}
