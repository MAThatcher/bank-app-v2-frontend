import React from 'react';
export default function AboutPage() {
  return <div className="about-page">
            <section className="about-hero">
                <div className="imperial-header"><p className="eyebrow">ADEPTUS ADMINISTRATUM / IMPERIAL ARCHIVES</p>
                    <h1 className="about-title">IMPERIAL CHARTER</h1>
                    <div className="aquila-divider">⛨</div>
                    <p className="about-subtitle">
                        The History and Mission of the Imperial Bank of Terra
                    </p>
                </div>
            </section>

            <section className="about-content">
                <div className="content-card">
                    <h2 className="section-heading">OUR FOUNDING</h2>
                    <p className="section-text">
                        Established in the early days of M31, following the Great Crusade, the Imperial 
                        Bank of Terra was sanctioned by the High Lords of Terra to manage the vast 
                        financial networks of a million worlds. For over 10,000 years, we have served 
                        as the economic backbone of the Imperium, ensuring that tithes flow, trade 
                        prospers, and the Emperor's domain remains financially secure.
                    </p>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">OUR MISSION</h2>
                    <p className="section-text">
                        To safeguard the wealth of the Imperium's loyal citizens through unwavering 
                        service, impenetrable security, and financial instruments blessed by the 
                        Adeptus Terra. We stand as the bulwark between prosperity and chaos, ensuring 
                        that every throne gelt is accounted for in the Emperor's great ledger.
                    </p>
                    <div className="imperial-quote">
                        "In currency we trust, in the Emperor we believe, in service we excel."
                        <br />- Bank Charter Maxim
                    </div>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">OUR VALUES</h2>
                    <ul className="values-list">
                        <li><strong>Loyalty:</strong> To the Emperor and the citizens of the Imperium</li>
                        <li><strong>Security:</strong> Fortress-grade protection for all assets</li>
                        <li><strong>Integrity:</strong> Every transaction recorded and sanctioned</li>
                        <li><strong>Service:</strong> Available across a million worlds</li>
                        <li><strong>Innovation:</strong> Blessed by the Adeptus Mechanicus</li>
                    </ul>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">THE ADMINISTRATUM NETWORK</h2>
                    <p className="section-text">
                        Our network spans the entire Imperium, from the gleaming spires of Holy Terra 
                        to the frontier worlds on the edge of known space. Through a combination of 
                        ancient cogitator systems, astropathic communication, and servo-skull couriers, 
                        we ensure that your assets are accessible wherever the Emperor's light reaches.
                    </p>
                    <div className="statistics-grid">
                        <div className="stat-item">
                            <div className="stat-number">10,000+</div>
                            <div className="stat-label">Years of Service</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">1,000,000+</div>
                            <div className="stat-label">Worlds Served</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">∞</div>
                            <div className="stat-label">Emperor's Blessing</div>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">SANCTIONED BY THE HIGH LORDS</h2>
                    <p className="section-text">
                        The Imperial Bank of Terra operates under direct sanction from the High Lords 
                        of Terra and the Adeptus Administratum. Our charters are sealed with the 
                        Emperor's own aquila, and our vaults are protected by the finest security 
                        protocols known to the Imperium. We are more than a bank – we are an 
                        institution of Imperial might.
                    </p>
                </div>

                <div className="purity-seal-footer">
                    <p>⚜ APPROVED BY THE IMPERIAL TITHE ⚜</p>
                    <p className="small-text">M3.025 - Glory to the Emperor</p>
                </div>
            </section>
        </div>;
}
