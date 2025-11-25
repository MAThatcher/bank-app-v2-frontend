import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AccountCard from '../components/dashboard/AccountCard';
import { getAccountsApi } from '../api/accountsApi';
import '../assets/styles/DashboardPage.css';


export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setLoading(true);
                const response = await getAccountsApi();
                setAccounts(response.data || []);
            } catch (err) {
                console.error('Error fetching accounts:', err);
                setError('Unable to retrieve vault data from the Administratum');
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleAccountSelect = (account) => {
        navigate(`/account/${account.id}`);
    };

    const getTotalBalance = () => {
        return accounts.reduce((sum, account) => sum + (Number.parseFloat(account.balance) || 0), 0);
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="welcome-section">
                        <div className="skull-icon">☠</div>
                        <h1 className="dashboard-title">IMPERIAL VAULT COMMAND</h1>
                        <p className="dashboard-subtitle">
                            Welcome, <span className="citizen-name">{user?.name || 'Loyal Citizen'}</span>
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="error-banner">
                        <span className="error-icon">⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <div className="card-icon">💰</div>
                        <h3 className="card-title">TOTAL THRONE GELT</h3>
                        <div className="card-value">
                            {loading ? '...' : `${getTotalBalance().toLocaleString()} ₮`}
                        </div>
                        <p className="card-description">Combined vault holdings</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon">🏛️</div>
                        <h3 className="card-title">ACTIVE VAULTS</h3>
                        <div className="card-value">{loading ? '...' : accounts.length}</div>
                        <p className="card-description">Sanctioned accounts</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon">🛡️</div>
                        <h3 className="card-title">SECURITY STATUS</h3>
                        <div className="card-value security-active">ACTIVE</div>
                        <p className="card-description">Servo-skull monitoring</p>
                    </div>

                    <div className="dashboard-card">
                        <div className="card-icon">📊</div>
                        <h3 className="card-title">TITHE COMPLIANCE</h3>
                        <div className="card-value">100%</div>
                        <p className="card-description">Emperor's coffers secured</p>
                    </div>
                </div>

                <div className="accounts-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            <span className="title-icon">🏛️</span>
                            YOUR IMPERIAL VAULTS
                        </h2>
                        <button
                            className="create-vault-button"
                            onClick={() => navigate('/account/create')}
                        >
                            <span className="button-icon">⚔</span>
                            ESTABLISH NEW VAULT
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Retrieving vault data from the Administratum...</p>
                        </div>
                    ) : accounts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📜</div>
                            <p className="empty-message">No vaults established yet</p>
                            <p className="empty-description">
                                Establish your first Imperial vault to begin securing your throne gelt
                            </p>
                        </div>
                    ) : (
                        <div className="accounts-grid">
                            {accounts.map((account) => (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                    onSelect={handleAccountSelect}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="imperial-notice">
                    <div className="notice-icon">⛨</div>
                    <p>
                        Your wealth serves the Imperium. All transactions are recorded in the
                        Book of Judgment and protected by the Omnissiah's blessing.
                    </p>
                </div>
            </div>
        </div>
    );
}