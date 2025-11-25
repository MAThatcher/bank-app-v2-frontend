import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccountByIdApi } from '../../api/accountsApi';
import { getTransactionsApi, createTransactionApi } from '../../api/transactionsApi';
import '../../assets/styles/AccountDetailPage.css';

export default function AccountDetailPage() {
    const { accountId } = useParams();
    const navigate = useNavigate();
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [transactionForm, setTransactionForm] = useState({
        transactionAmount: '',
        description: '',
        category: ''
    });
    const [transactionError, setTransactionError] = useState(null);
    const [transactionLoading, setTransactionLoading] = useState(false);

    useEffect(() => {
        fetchAccountData();
    }, [accountId]);

    const fetchAccountData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [accountResponse, transactionsResponse] = await Promise.all([
                getAccountByIdApi(accountId),
                getTransactionsApi(accountId)
            ]);

            setAccount(accountResponse.data);
            setTransactions(transactionsResponse.data || []);
        } catch (err) {
            console.error('Error fetching account data:', err);
            setError('Unable to retrieve vault data from the Administratum');
        } finally {
            setLoading(false);
        }
    };

    const handleTransactionChange = (e) => {
        const { name, value } = e.target;
        setTransactionForm({
            ...transactionForm,
            [name]: value
        });
    };

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        setTransactionError(null);

        if (!transactionForm.transactionAmount || isNaN(transactionForm.transactionAmount)) {
            setTransactionError('Valid transaction amount required');
            return;
        }

        if (!transactionForm.description || transactionForm.description.trim().length === 0) {
            setTransactionError('Transaction description required');
            return;
        }

        setTransactionLoading(true);

        try {
            await createTransactionApi({
                accountId: parseInt(accountId),
                transactionAmount: parseFloat(transactionForm.transactionAmount),
                description: transactionForm.description.trim(),
                category: transactionForm.category.trim() || 'General'
            });

            // Reset form and refresh data
            setTransactionForm({
                transactionAmount: '',
                description: '',
                category: ''
            });
            setShowTransactionForm(false);
            await fetchAccountData();
        } catch (err) {
            console.error('Transaction error:', err);
            setTransactionError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                'Transaction failed. The Administratum could not process your request.'
            );
        } finally {
            setTransactionLoading(false);
        }
    };

    const formatBalance = (balance) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(balance || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="account-detail-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Retrieving vault data from the Administratum...</p>
                </div>
            </div>
        );
    }

    if (error || !account) {
        return (
            <div className="account-detail-page">
                <div className="error-container">
                    <div className="error-icon">⚠</div>
                    <p>{error || 'Vault not found'}</p>
                    <button onClick={() => navigate('/dashboard')} className="return-button">
                        RETURN TO COMMAND CENTER
                    </button>
                </div>
            </div>
        );
    }

    const balanceStatus = account.balance < 0 ? (account.overdraft ? 'warning' : 'critical') : 'positive';

    return (
        <div className="account-detail-page">
            <div className="account-detail-container">
                {/* Header */}
                <div className="page-header">
                    <button onClick={() => navigate('/dashboard')} className="back-button">
                        ← RETURN TO VAULTS
                    </button>
                    <h1 className="page-title">
                        <span className="title-icon">🏛️</span>
                        {account.accountName || 'Imperial Vault'}
                    </h1>
                </div>

                {/* Account Summary */}
                <div className="account-summary">
                    <div className="summary-card balance-card">
                        <span className="summary-label">CURRENT BALANCE</span>
                        <div className={`balance-display ${balanceStatus}`}>
                            {formatBalance(account.balance)} ₮
                        </div>
                    </div>

                    <div className="summary-card">
                        <span className="summary-label">VAULT ID</span>
                        <div className="summary-value">#{account.id}</div>
                    </div>

                    <div className="summary-card">
                        <span className="summary-label">OVERDRAFT STATUS</span>
                        <div className={`summary-value ${account.overdraft ? 'active' : 'inactive'}`}>
                            {account.overdraft ? 'SANCTIONED' : 'DENIED'}
                        </div>
                    </div>

                    <div className="summary-card">
                        <span className="summary-label">TOTAL TRANSACTIONS</span>
                        <div className="summary-value">{transactions.length}</div>
                    </div>
                </div>

                {/* Transaction Actions */}
                <div className="transaction-actions">
                    {!showTransactionForm ? (
                        <button
                            onClick={() => setShowTransactionForm(true)}
                            className="action-button primary"
                        >
                            <span className="button-icon">⚔</span>
                            INITIATE TRANSACTION
                        </button>
                    ) : (
                        <div className="transaction-form-container">
                            <h3 className="form-title">
                                <span className="form-icon">📜</span>
                                NEW TRANSACTION
                            </h3>
                            <form onSubmit={handleTransactionSubmit} className="transaction-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="transactionAmount" className="form-label">
                                            AMOUNT (₮) *
                                        </label>
                                        <input
                                            id="transactionAmount"
                                            name="transactionAmount"
                                            type="number"
                                            step="0.01"
                                            value={transactionForm.transactionAmount}
                                            onChange={handleTransactionChange}
                                            className="form-input"
                                            placeholder="Enter amount (positive for deposit, negative for withdrawal)"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="category" className="form-label">
                                            CATEGORY
                                        </label>
                                        <input
                                            id="category"
                                            name="category"
                                            type="text"
                                            value={transactionForm.category}
                                            onChange={handleTransactionChange}
                                            className="form-input"
                                            placeholder="e.g., Tithe, Trade, Wages"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description" className="form-label">
                                        DESCRIPTION *
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={transactionForm.description}
                                        onChange={handleTransactionChange}
                                        className="form-textarea"
                                        placeholder="Enter transaction details..."
                                        rows="3"
                                        required
                                    />
                                </div>

                                {transactionError && (
                                    <div className="error-message">
                                        <span className="error-icon">⚠</span>
                                        {transactionError}
                                    </div>
                                )}

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowTransactionForm(false);
                                            setTransactionError(null);
                                            setTransactionForm({
                                                transactionAmount: '',
                                                description: '',
                                                category: ''
                                            });
                                        }}
                                        className="action-button secondary"
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        type="submit"
                                        className="action-button primary"
                                        disabled={transactionLoading}
                                    >
                                        {transactionLoading ? 'PROCESSING...' : 'EXECUTE TRANSACTION'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Transactions List */}
                <div className="transactions-section">
                    <h2 className="section-title">
                        <span className="section-icon">📜</span>
                        TRANSACTION LEDGER
                    </h2>

                    {transactions.length === 0 ? (
                        <div className="empty-transactions">
                            <div className="empty-icon">📋</div>
                            <p className="empty-message">No transactions recorded</p>
                            <p className="empty-description">
                                Initiate your first transaction to begin the ledger
                            </p>
                        </div>
                    ) : (
                        <div className="transactions-list">
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className="transaction-item">
                                    <div className="transaction-main">
                                        <div className="transaction-icon">
                                            {transaction.amount >= 0 ? '⬆' : '⬇'}
                                        </div>
                                        <div className="transaction-info">
                                            <div className="transaction-description">
                                                {transaction.description}
                                            </div>
                                            <div className="transaction-meta">
                                                <span className="transaction-date">
                                                    {formatDate(transaction.create_date)}
                                                </span>
                                                {transaction.category && (
                                                    <>
                                                        <span className="meta-separator">•</span>
                                                        <span className="transaction-category">
                                                            {transaction.category}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                                        {transaction.amount >= 0 ? '+' : ''}
                                        {formatBalance(transaction.amount)} ₮
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="imperial-notice">
                    <div className="notice-icon">⛨</div>
                    <p>
                        All transactions are recorded in the Book of Judgment and protected by the Omnissiah's blessing.
                    </p>
                </div>
            </div>
        </div>
    );
}
