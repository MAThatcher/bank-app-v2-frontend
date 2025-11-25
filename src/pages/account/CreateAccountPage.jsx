import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAccountApi } from '../../api/accountsApi';
import '../../assets/styles/AuthPages.css';
import aquilaImage from '../../assets/images/40k_imperial_aquila__transparent__by_fuguestock_d91enql-fullview.png';

export default function CreateAccountPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        accountName: '',
        overdraft: false
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateForm = () => {
        if (!formData.accountName || formData.accountName.trim().length === 0) {
            setError('Vault designation is required by Imperial decree');
            return false;
        }

        if (formData.accountName.length > 100) {
            setError('Vault designation must not exceed 100 characters');
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
            const accountData = {
                accountName: formData.accountName.trim()
            };

            await createAccountApi(accountData);
            
            // Success - redirect to dashboard
            navigate('/dashboard', { 
                state: { 
                    message: 'Imperial Vault established successfully! The Administratum has recorded your holdings.' 
                } 
            });
        } catch (err) {
            console.error('Create account error:', err);
            setError(
                err.response?.data?.error || 
                err.response?.data?.message || 
                'Vault creation failed. The Administratum could not process your request.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <img src={aquilaImage} alt="Imperial Aquila" className="brand-aquila-img" />
                    <h1 className="auth-title">ESTABLISH NEW VAULT-THRONE</h1>
                    <p className="auth-subtitle">
                        Create a new Imperial vault to secure your throne gelt
                    </p>

                    <div className="purity-seal-small">
                        ⚜ ADMINISTRATUM AUTHORIZATION ⚜
                    </div>

                    <form onSubmit={submit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="accountName" className="form-label">
                                VAULT DESIGNATION *
                            </label>
                            <input
                                id="accountName"
                                name="accountName"
                                type="text"
                                value={formData.accountName}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Main Vault, Trading Account, Savings, etc."
                                required
                                maxLength={100}
                            />
                            <small className="form-hint">
                                Provide a name to identify this vault (e.g., "Primary Holdings", "Trade Reserves")
                            </small>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    name="overdraft"
                                    checked={formData.overdraft}
                                    onChange={handleChange}
                                    className="form-checkbox"
                                />
                                <span className="checkbox-text">
                                    REQUEST OVERDRAFT PROTECTION
                                </span>
                            </label>
                            <small className="form-hint" style={{ marginTop: '8px', display: 'block' }}>
                                Allow transactions that exceed your balance (subject to Administratum approval)
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
                            {loading ? 'ESTABLISHING VAULT...' : 'ESTABLISH VAULT-THRONE'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-link-text">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="auth-link"
                            >
                                Return to Command Center
                            </button>
                        </p>
                    </div>

                    <div className="imperial-decree-small">
                        "Every throne gelt secured is a tithe to the Emperor's glory"
                    </div>
                </div>
            </div>
        </div>
    );
}
