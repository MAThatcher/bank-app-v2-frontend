import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="imperial-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>THE ADMINISTRATUM</h4>
                    <ul>
                        <li><Link to="/about">Imperial Charter</Link></li>
                        <li><a href="https://github.com/MAThatcher/bank-app-v2-frontend" target="_blank" rel="noopener noreferrer">Frontend Codex</a></li>
                        <li><a href="https://github.com/MAThatcher/bank-app-v2-backend" target="_blank" rel="noopener noreferrer">Backend Archives</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>SANCTIONED SERVICES</h4>
                    <ul>
                        <li><a href="#checking">Throne Gelt Accounts</a></li>
                        <li><a href="#savings">Treasure Vaults</a></li>
                        <li><a href="#loans">Imperial Sanctions</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>SUPPORT DIVISION</h4>
                    <ul>
                        <li><Link to="/help">Cogitator Archives</Link></li>
                        <li><Link to="/contact">Scribe Contact</Link></li>
                        <li><Link to="/security">Fortress Protocols</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>IMPERIAL DECREES</h4>
                    <ul>
                        <li><Link to="/privacy">Privacy Sanctum</Link></li>
                        <li><Link to="/terms">Terms of Binding</Link></li>
                        <li><Link to="/compliance">Inquisitorial Compliance</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>⛨ M3.025 - The Imperial Bank of Terra - Serving the Imperium for 10,000 Years ⛨</p>
                <p className="imperial-motto">"In the Emperor's name, we secure your wealth"</p>
            </div>
        </footer>
    );
}
