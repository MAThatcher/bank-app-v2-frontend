import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import '../assets/styles/HomePage.css';
import inquisitionImage from '../assets/images/warhammer-40k-inquisition.png';


export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <img src={inquisitionImage} alt="Inquisition" style={{ width: '40px', height: 'auto' }} />
                    <h1 className="hero-title">THE IMPERIAL BANK OF TERRA</h1>
                    <p className="hero-subtitle">
                        In the grim darkness of the far future, there is only finance.
                        Secure your wealth across a million worlds under the Emperor's watchful gaze.
                    </p>
                    <div className="imperial-quote">
                        "The currency of the Imperium flows through us all" - Administratum Decree 40.003
                    </div>
                    <div className="hero-actions">
                        <Button onClick={() => navigate('/register')} className="btn-primary">
                            ENLIST YOUR ASSETS
                        </Button>
                        <Button onClick={() => navigate('/login')} className="btn-secondary">
                            ACCESS VAULT
                        </Button>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="hero-placeholder">
                        {/* Imperial Aquila illustration */}
                        <svg width="400" height="300" viewBox="0 0 400 300" fill="none">
                            {/* Gothic Architecture */}
                            <rect x="50" y="80" width="300" height="180" fill="#1a1a1a" stroke="#8B0000" strokeWidth="3" />
                            <rect x="70" y="100" width="260" height="140" fill="#0a0a0a" stroke="#8B0000" strokeWidth="2" />
                            {/* Imperial Aquila wings */}
                            <path d="M200 120 L160 160 L180 180 L200 160 L220 180 L240 160 Z" fill="#8B0000" opacity="0.8" />
                            <circle cx="200" cy="150" r="30" fill="#8B0000" stroke="#FFD700" strokeWidth="2" />
                            <circle cx="200" cy="150" r="20" fill="#0a0a0a" />
                            {/* Gothic details */}
                            <line x1="100" y1="100" x2="100" y2="240" stroke="#8B0000" strokeWidth="2" />
                            <line x1="150" y1="100" x2="150" y2="240" stroke="#8B0000" strokeWidth="2" />
                            <line x1="250" y1="100" x2="250" y2="240" stroke="#8B0000" strokeWidth="2" />
                            <line x1="300" y1="100" x2="300" y2="240" stroke="#8B0000" strokeWidth="2" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">SERVICES OF THE ADMINISTRATUM</h2>
                <div className="purity-seal">⚜ APPROVED BY THE IMPERIAL TITHE ⚜</div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3 className="feature-title">FORTRESS-GRADE SECURITY</h3>
                        <p className="feature-description">
                            Your throne gelt protected by encryption protocols blessed by the
                            Adeptus Mechanicus. Servo-skull authentication ensures absolute security.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3 className="feature-title">WARP-SPEED TRANSFERS</h3>
                        <p className="feature-description">
                            Transfer assets across the Imperium faster than an Astropath's message.
                            Available across all 10,000 years of service.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📜</div>
                        <h3 className="feature-title">COGITATOR ANALYTICS</h3>
                        <p className="feature-description">
                            Sacred algorithms track your expenditures and tithes with machine spirit
                            precision. The Omnissiah guides your wealth.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🗡️</div>
                        <h3 className="feature-title">SANCTIONED CREDIT TOKENS</h3>
                        <p className="feature-description">
                            Issue Imperial-blessed credit chits with customizable tithe limits.
                            Each transaction recorded in the Book of Judgment.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🌌</div>
                        <h3 className="feature-title">GALAXY-WIDE REACH</h3>
                        <p className="feature-description">
                            Access your account from any Imperial world, void station, or hive city.
                            The Emperor's currency knows no bounds.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">⛨</div>
                        <h3 className="feature-title">ETERNAL VIGILANCE</h3>
                        <p className="feature-description">
                            Our Administratum scribes stand ready to serve you at all hours.
                            No query is too heretical... err, complex.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <div className="emperor-quote">
                        <img src={inquisitionImage} alt="Inquisition" style={{ width: '50px', height: 'auto' }} />
                    </div>
                    <h2 className="cta-title">FOR THE EMPEROR'S COFFERS!</h2>
                    <p className="cta-description">
                        Join millions of loyal Imperial citizens who entrust their wealth to the Administratum.
                        Your tithe secures the Imperium.
                    </p>
                    <div className="imperial-decree">
                        "In wealth, we find duty. In duty, we find the Emperor's grace."
                    </div>
                    <Button onClick={() => navigate('/register')} className="btn-cta">
                        ESTABLISH YOUR VAULT-THRONE
                    </Button>
                </div>
            </section>
        </div>
    );
}