import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../../api/usersApi';
import '../../assets/styles/AuthPages.css';
import aquilaImage from '../../assets/images/40k_imperial_aquila__transparent__by_fuguestock_d91enql-fullview.png';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        citizenship: '',
        sector: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields marked with * are required by Imperial decree');
            return false;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters (Security Protocol 40K)');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match - verification failed');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Invalid vox-mail address format');
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

        setLoading(true);

        try {
            // Call the registration API
            await registerApi({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                citizenship: formData.citizenship,
                sector: formData.sector
            });

            // Success - redirect to login
            alert('Account created successfully! Please sign in.');
            navigate('/login');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. The Administratum denies your request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <img src={aquilaImage} alt="Imperial Aquila" className="brand-aquila-img" />
                    <h1 className="auth-title">IMPERIAL CITIZEN REGISTRATION</h1>
                    <p className="auth-subtitle">
                        Declare your loyalty and establish your vault-throne
                    </p>

                    <div className="purity-seal-small">
                        ⚜ ADMINISTRATUM APPROVED ⚜
                    </div>

                    <form onSubmit={submit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                CITIZEN NAME *
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter your full designation"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                VOX-MAIL ADDRESS *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="citizen@imperium.terra"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="citizenship" className="form-label">
                                    HOMEWORLD
                                </label>
                                <input
                                    id="citizenship"
                                    name="citizenship"
                                    type="text"
                                    value={formData.citizenship}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Terra, Mars, etc."
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="sector" className="form-label">
                                    SECTOR
                                </label>
                                <input
                                    id="sector"
                                    name="sector"
                                    type="text"
                                    value={formData.sector}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Segmentum Solar"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                SECURITY CIPHER *
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
                                CONFIRM CIPHER *
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
                            {loading ? 'PROCESSING ENROLLMENT...' : 'ENLIST IN THE IMPERIUM'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-link-text">
                            Already enlisted?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="auth-link"
                            >
                                Access your vault
                            </button>
                        </p>
                    </div>

                    <div className="imperial-decree-small">
                        "By registering, you pledge your wealth to the Emperor's service"
                    </div>
                </div>
            </div>
        </div>
    );
}
