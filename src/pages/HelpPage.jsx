import React from 'react';
import '../assets/styles/HelpPage.css';

export default function HelpPage() {
    return (
        <div className="help-page">
            <section className="help-hero">
                <div className="imperial-header">
                    <h1 className="help-title">COGITATOR ARCHIVES</h1>
                    <div className="aquila-divider">⛨</div>
                    <p className="help-subtitle">
                        Sacred Knowledge to Serve the Emperor's Faithful
                    </p>
                </div>
            </section>

            <section className="help-content">
                <div className="content-card">
                    <h2 className="section-heading">📚 FREQUENTLY CONSULTED ARCHIVES</h2>
                    
                    <div className="faq-item">
                        <h3 className="faq-question">How do I create a new Throne Gelt Account?</h3>
                        <p className="faq-answer">
                            Navigate to your dashboard and select "Create New Account." Choose your account 
                            type and follow the sacred protocols. The process requires Imperial authorization 
                            and will be blessed by the Machine Spirit within moments.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">How do I transfer funds between accounts?</h3>
                        <p className="faq-answer">
                            From your account details page, select "Initiate Transfer." Enter the recipient's 
                            account identifier, the amount in throne gelt, and authorize with your Imperial 
                            seal. Transfers are processed through secure Astropathic channels.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">What security protocols protect my account?</h3>
                        <p className="faq-answer">
                            Your assets are protected by Fortress-grade encryption blessed by the Adeptus 
                            Mechanicus, servo-skull authentication, multi-factor Imperial verification, and 
                            constant monitoring by our Inquisitorial compliance division.
                        </p>
                    </div>

                    <div className="faq-item">
                        <h3 className="faq-question">How do I reset my authentication credentials?</h3>
                        <p className="faq-answer">
                            If you have forgotten your credentials, select "Forgot Password" on the login 
                            page. An Astropathic message will be sent to your registered vox-address with 
                            instructions to reset your authentication codes.
                        </p>
                    </div>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">⚙️ ACCOUNT MANAGEMENT</h2>
                    <ul className="help-list">
                        <li><strong>Account Creation:</strong> Requires Imperial citizenship and valid identification</li>
                        <li><strong>Account Types:</strong> Standard Throne Gelt, Treasure Vault, and Sanctioned Credit</li>
                        <li><strong>Transaction Limits:</strong> Set by Administratum decree based on account tier</li>
                        <li><strong>Statement Access:</strong> Available through your dashboard at any time</li>
                        <li><strong>Account Closure:</strong> Contact Scribe Support for decommissioning protocols</li>
                    </ul>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">🛡️ SECURITY PROTOCOLS</h2>
                    <ul className="help-list">
                        <li><strong>Two-Factor Authentication:</strong> Enabled by default for all citizens</li>
                        <li><strong>Session Monitoring:</strong> Automatic logout after period of inactivity</li>
                        <li><strong>Encryption:</strong> All data protected by Mechanicus-blessed algorithms</li>
                        <li><strong>Fraud Detection:</strong> Continuous monitoring by Inquisitorial agents</li>
                        <li><strong>Secure Communications:</strong> All transmissions encrypted end-to-end</li>
                    </ul>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">📡 TECHNICAL SUPPORT</h2>
                    <p className="section-text">
                        If you cannot find the answer in these archives, our Tech-Priests are available 
                        to assist you. Contact our Support Division through the official channels, and a 
                        Scribe will respond within one standard Terran day.
                    </p>
                    <div className="contact-info">
                        <p><strong>Vox Channel:</strong> support@imperialbank.terra</p>
                        <p><strong>Astropathic Code:</strong> HELP-40K</p>
                        <p><strong>Operating Hours:</strong> 24/7 across all time zones</p>
                    </div>
                </div>

                <div className="purity-seal-footer">
                    <p>⚜ MAY THE EMPEROR GUIDE YOUR TRANSACTIONS ⚜</p>
                    <p className="small-text">M3.025 - In Service to the Imperium</p>
                </div>
            </section>
        </div>
    );
}
