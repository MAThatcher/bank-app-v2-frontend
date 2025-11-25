import React from 'react';
import '../assets/styles/ContactPage.css';

export default function ContactPage() {
    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="imperial-header">
                    <h1 className="contact-title">SCRIBE CONTACT</h1>
                    <div className="aquila-divider">⛨</div>
                    <p className="contact-subtitle">
                        Reach Out to the Administratum Support Division
                    </p>
                </div>
            </section>

            <section className="contact-content">
                <div className="content-card">
                    <h2 className="section-heading">📡 VOX CHANNELS</h2>
                    <div className="contact-methods">
                        <div className="contact-method">
                            <h3>Astropathic Communication</h3>
                            <p className="contact-detail">support@imperialbank.terra</p>
                            <p className="contact-description">
                                Send your inquiries via sanctioned vox-mail. Our Scribes monitor 
                                transmissions continuously and respond within one standard Terran day.
                            </p>
                        </div>

                        <div className="contact-method">
                            <h3>Emergency Beacon</h3>
                            <p className="contact-detail">ALERT-CODE: TERRA-999</p>
                            <p className="contact-description">
                                For urgent security matters or suspected fraud, activate this emergency 
                                channel. Inquisitorial response teams stand ready.
                            </p>
                        </div>

                        <div className="contact-method">
                            <h3>Cogitator Archives</h3>
                            <p className="contact-detail">help@imperialbank.terra</p>
                            <p className="contact-description">
                                Access our comprehensive knowledge base for immediate answers to 
                                common inquiries and technical guidance.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">🏛️ ADMINISTRATUM OFFICES</h2>
                    <div className="office-locations">
                        <div className="office">
                            <h3>Holy Terra - Prime Headquarters</h3>
                            <p>Imperial Palace District, Administratum Spire 7</p>
                            <p>Sector: Sol System, Segmentum Solar</p>
                            <p className="office-hours">Open: 24/7/365.M3</p>
                        </div>

                        <div className="office">
                            <h3>Mars - Mechanicus Liaison</h3>
                            <p>Olympus Mons Banking Complex, Level 42</p>
                            <p>Sector: Sol System, Segmentum Solar</p>
                            <p className="office-hours">Open: By Appointment</p>
                        </div>

                        <div className="office">
                            <h3>Macragge - Eastern Fringe Office</h3>
                            <p>Fortress of Hera, Financial Wing</p>
                            <p>Sector: Ultramar, Segmentum Ultima</p>
                            <p className="office-hours">Open: Standard Imperial Hours</p>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">📜 DEPARTMENT CONTACTS</h2>
                    <div className="departments">
                        <div className="department">
                            <h3>Account Services</h3>
                            <p>For questions regarding accounts, balances, and transactions</p>
                            <p className="dept-contact">accounts@imperialbank.terra</p>
                        </div>

                        <div className="department">
                            <h3>Security & Fraud Division</h3>
                            <p>Report suspicious activity or security concerns</p>
                            <p className="dept-contact">security@imperialbank.terra</p>
                        </div>

                        <div className="department">
                            <h3>Technical Support</h3>
                            <p>Assistance with platform access and technical issues</p>
                            <p className="dept-contact">techsupport@imperialbank.terra</p>
                        </div>

                        <div className="department">
                            <h3>Compliance & Inquiries</h3>
                            <p>Inquisitorial matters and regulatory questions</p>
                            <p className="dept-contact">compliance@imperialbank.terra</p>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">⏰ RESPONSE TIMES</h2>
                    <div className="response-info">
                        <p className="section-text">
                            Our Scribes are dedicated to serving the Emperor's faithful with efficiency 
                            and devotion. Expected response times by priority:
                        </p>
                        <ul className="response-list">
                            <li><strong>Critical Security Issues:</strong> Immediate response (within 1 hour)</li>
                            <li><strong>Urgent Account Matters:</strong> Within 4 hours</li>
                            <li><strong>General Inquiries:</strong> Within 24 hours</li>
                            <li><strong>Technical Support:</strong> Within 24-48 hours</li>
                            <li><strong>Administrative Requests:</strong> Within 3-5 business days</li>
                        </ul>
                    </div>
                </div>

                <div className="purity-seal-footer">
                    <p>⚜ THE EMPEROR PROTECTS ⚜</p>
                    <p className="small-text">M3.025 - Always in Service</p>
                </div>
            </section>
        </div>
    );
}
