import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/styles/AccountCard.css';

export default function AccountCard({ account, onSelect }) {
    const formatBalance = (balance) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(balance || 0);
    };

    const getBalanceStatus = (balance, overdraft) => {
        if (balance < 0) {
            return overdraft ? 'warning' : 'critical';
        }
        return 'positive';
    };

    const balanceStatus = getBalanceStatus(account.balance, account.overdraft);

    return (
        <div
            className={`account-card ${onSelect ? 'clickable' : ''}`}
            onClick={() => onSelect && onSelect(account)}
        >
            <div className="account-card-header">
                <div className="account-icon">🏛️</div>
                <div className="account-info">
                    <h3 className="account-name">{account.name || 'Imperial Vault'}</h3>
                    <span className="account-id">Account #{account.id}</span>
                </div>
            </div>

            <div className="account-card-body">
                <div className="balance-section">
                    <span className="balance-label">THRONE GELT BALANCE</span>
                    <div className={`balance-amount ${balanceStatus}`}>
                        {formatBalance(account.balance)} ₮
                    </div>
                </div>

                <div className="account-details">
                    <div className="detail-item">
                        <span className="detail-icon">⚔</span>
                        <div className="detail-content">
                            <span className="detail-label">Owner</span>
                            <span className="detail-value">
                                {account.ownerName || 'Unknown'}
                            </span>
                        </div>
                    </div>

                    {account.overdraft !== undefined && (
                        <div className="detail-item">
                            <span className="detail-icon">🛡️</span>
                            <div className="detail-content">
                                <span className="detail-label">Overdraft Protection</span>
                                <span className={`detail-value ${account.overdraft ? 'active' : 'inactive'}`}>
                                    {account.overdraft ? 'SANCTIONED' : 'DENIED'}
                                </span>
                            </div>
                        </div>
                    )}

                    {account.createdAt && (
                        <div className="detail-item">
                            <span className="detail-icon">📜</span>
                            <div className="detail-content">
                                <span className="detail-label">Established</span>
                                <span className="detail-value">
                                    {new Date(account.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {account.balance < 0 && !account.overdraft && (
                <div className="account-alert">
                    <span className="alert-icon">⚠</span>
                    <span>NEGATIVE BALANCE - OVERDRAFT NOT AUTHORIZED</span>
                </div>
            )}

            {onSelect && (
                <div className="account-card-footer">
                    <span className="view-details">VIEW VAULT DETAILS →</span>
                </div>
            )}
        </div>
    );
}

AccountCard.propTypes = {
    account: PropTypes.shape({
        id: PropTypes.number.isRequired,
        accountName: PropTypes.string,
        balance: PropTypes.number,
        overdraft: PropTypes.bool,
        ownerName: PropTypes.string,
        createdAt: PropTypes.string
    }).isRequired,
    onSelect: PropTypes.func
};
