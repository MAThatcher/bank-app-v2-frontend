import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import aquilaImage from '../../assets/images/40k_imperial_aquila__transparent__by_fuguestock_d91enql-fullview.png';
import './Header.css';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="imperial-header-nav">
            <div className="header-container">
                {/* Logo/Brand */}
                <div className="header-brand" onClick={() => navigate(user ? '/dashboard' : '/')}>
                    <img src={aquilaImage} alt="Imperial Aquila" className="brand-aquila-img" />
                    <div className="brand-text">
                        <span className="brand-title">IMPERIAL BANK</span>
                        <span className="brand-subtitle">OF TERRA</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="header-nav">
                    {user ? (
                        <>
                            <button
                                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                                onClick={() => navigate('/dashboard')}
                            >
                                <span className="nav-icon">🏛️</span>
                                VAULT
                            </button>
                            <button
                                className="nav-link"
                                onClick={() => {/* TODO: Add accounts page */ }}
                            >
                                <span className="nav-icon">💰</span>
                                ACCOUNTS
                            </button>
                            <button
                                className="nav-link"
                                onClick={() => {/* TODO: Add transfers page */ }}
                            >
                                <span className="nav-icon">⚡</span>
                                TRANSFERS
                            </button>
                            <div className="nav-divider"></div>
                            <div className="user-info">
                                <span className="user-icon">👤</span>
                                <span className="user-name">{user?.name || 'Citizen'}</span>
                            </div>
                            <button className="nav-link logout-btn" onClick={handleLogout}>
                                <span className="nav-icon">🚪</span>
                                LOGOUT
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`nav-link ${isActive('/login') ? 'active' : ''}`}
                                onClick={() => navigate('/login')}
                            >
                                <span className="nav-icon">🔐</span>
                                ACCESS VAULT
                            </button>
                            <button
                                className={`nav-link enlist-btn ${isActive('/register') ? 'active' : ''}`}
                                onClick={() => navigate('/register')}
                            >
                                <span className="nav-icon">⚔️</span>
                                ENLIST NOW
                            </button>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-icon">{mobileMenuOpen ? '✕' : '☰'}</span>
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="mobile-nav">
                    {user ? (
                        <>
                            <button
                                className={`mobile-nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                                onClick={() => {
                                    navigate('/dashboard');
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <span className="nav-icon">🏛️</span>
                                VAULT
                            </button>
                            <button
                                className="mobile-nav-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="nav-icon">💰</span>
                                ACCOUNTS
                            </button>
                            <button
                                className="mobile-nav-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="nav-icon">⚡</span>
                                TRANSFERS
                            </button>
                            <div className="mobile-user-info">
                                <span className="user-icon">👤</span>
                                <span className="user-name">{user?.name || 'Citizen'}</span>
                            </div>
                            <button
                                className="mobile-nav-link logout-btn"
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <span className="nav-icon">🚪</span>
                                LOGOUT
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={`mobile-nav-link ${isActive('/login') ? 'active' : ''}`}
                                onClick={() => {
                                    navigate('/login');
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <span className="nav-icon">🔐</span>
                                ACCESS VAULT
                            </button>
                            <button
                                className={`mobile-nav-link enlist-btn ${isActive('/register') ? 'active' : ''}`}
                                onClick={() => {
                                    navigate('/register');
                                    setMobileMenuOpen(false);
                                }}
                            >
                                <span className="nav-icon">⚔️</span>
                                ENLIST NOW
                            </button>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
