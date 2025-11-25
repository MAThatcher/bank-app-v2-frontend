import React from 'react';
import '../assets/styles/SecurityPage.css';

export default function SecurityPage() {
    return (
        <div className="security-page">
            <section className="security-hero">
                <div className="imperial-header">
                    <h1 className="security-title">FORTRESS PROTOCOLS</h1>
                    <div className="aquila-divider">⛨</div>
                    <p className="security-subtitle">
                        Imperial Security Measures & Compliance Standards
                    </p>
                </div>
            </section>

            <section className="security-content">
                <div className="content-card">
                    <h2 className="section-heading">🛡️ DEFENSE PROTOCOLS</h2>
                    <p className="section-text">
                        The Imperial Bank of Terra employs the most advanced security measures known 
                        to the Imperium. Every aspect of our infrastructure is fortified to protect 
                        your assets from the enemies within and without.
                    </p>
                    <div className="security-features">
                        <div className="security-feature">
                            <h3>⚙️ Mechanicus-Blessed Encryption</h3>
                            <p>
                                All data is encrypted using algorithms sanctified by the Adeptus Mechanicus. 
                                Our encryption protocols employ 256-bit AES standards, blessed with sacred 
                                oils and chanted over by Tech-Priests.
                            </p>
                        </div>

                        <div className="security-feature">
                            <h3>🔐 Multi-Factor Authentication</h3>
                            <p>
                                Access requires multiple forms of verification: your sacred password, 
                                servo-skull recognition codes, and biometric authentication. The Machine 
                                Spirit verifies your identity at every step.
                            </p>
                        </div>

                        <div className="security-feature">
                            <h3>👁️ Continuous Monitoring</h3>
                            <p>
                                Our Inquisitorial security division maintains constant vigilance. Advanced 
                                cogitators analyze every transaction for signs of fraud, heresy, or 
                                unauthorized access attempts.
                            </p>
                        </div>

                        <div className="security-feature">
                            <h3>🔒 Secure Session Management</h3>
                            <p>
                                All sessions are encrypted end-to-end. Automatic logout protocols engage 
                                after periods of inactivity, ensuring your vault remains sealed even if 
                                you are called away on the Emperor's business.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">⚖️ COMPLIANCE STANDARDS</h2>
                    <p className="section-text">
                        The Imperial Bank of Terra operates in full compliance with all Administratum 
                        decrees, Inquisitorial edicts, and High Lord mandates. Our commitment to 
                        regulatory excellence is absolute.
                    </p>
                    <ul className="compliance-list">
                        <li><strong>Imperial Financial Regulations (IFR-40K):</strong> Full compliance with all tithe and transaction laws</li>
                        <li><strong>Data Protection Decree (DPD-M3):</strong> Safeguarding citizen information per Administratum standards</li>
                        <li><strong>Inquisitorial Oversight Protocol:</strong> Regular audits and security assessments</li>
                        <li><strong>Mechanicus Technical Standards:</strong> All systems blessed and certified by Mars</li>
                        <li><strong>Anti-Heresy Financial Laws:</strong> Preventing unauthorized or corrupted transactions</li>
                        <li><strong>Cross-Sector Banking Regulations:</strong> Compliant across all Segmentums</li>
                    </ul>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">🔍 FRAUD PREVENTION</h2>
                    <p className="section-text">
                        We employ sophisticated detection systems to identify and prevent fraudulent 
                        activity before it can threaten your assets.
                    </p>
                    <div className="fraud-measures">
                        <div className="fraud-item">
                            <h4>Real-Time Transaction Analysis</h4>
                            <p>
                                Every transaction is scanned by cogitator arrays for suspicious patterns. 
                                Unusual activity triggers immediate investigation by our security Scribes.
                            </p>
                        </div>

                        <div className="fraud-item">
                            <h4>Behavioral Authentication</h4>
                            <p>
                                Machine spirits learn your typical banking patterns. Deviations from 
                                normal behavior prompt additional verification requirements.
                            </p>
                        </div>

                        <div className="fraud-item">
                            <h4>Emergency Response Teams</h4>
                            <p>
                                Suspected fraud activates our rapid response protocols. Accounts can be 
                                instantly locked while Inquisitorial agents investigate.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">📋 REPORTING SECURITY CONCERNS</h2>
                    <p className="section-text">
                        If you suspect unauthorized access, fraudulent activity, or security breaches, 
                        report immediately through these sanctioned channels:
                    </p>
                    <div className="reporting-channels">
                        <div className="channel">
                            <h4>🚨 Emergency Security Alert</h4>
                            <p className="channel-contact">security@imperialbank.terra</p>
                            <p>For immediate threats requiring urgent response</p>
                        </div>

                        <div className="channel">
                            <h4>📞 Fraud Hotline</h4>
                            <p className="channel-contact">ALERT-CODE: FRAUD-WATCH</p>
                            <p>24/7 direct line to fraud investigation teams</p>
                        </div>

                        <div className="channel">
                            <h4>📝 Compliance Reporting</h4>
                            <p className="channel-contact">compliance@imperialbank.terra</p>
                            <p>For regulatory concerns or suspicious activity</p>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <h2 className="section-heading">🛠️ YOUR SECURITY RESPONSIBILITIES</h2>
                    <p className="section-text">
                        While we provide fortress-grade protection, citizens must also follow sacred 
                        security protocols:
                    </p>
                    <ul className="user-responsibilities">
                        <li>Never share your authentication credentials with anyone</li>
                        <li>Use strong, unique passwords blessed by complexity requirements</li>
                        <li>Enable all available security features on your account</li>
                        <li>Verify the authenticity of all communications claiming to be from us</li>
                        <li>Report suspicious activity immediately</li>
                        <li>Keep your contact information current</li>
                        <li>Log out completely when accessing from shared cogitators</li>
                        <li>Regularly review your transaction history for unauthorized activity</li>
                    </ul>
                </div>

                <div className="purity-seal-footer">
                    <p>⚜ VIGILANCE IS THE PRICE OF SECURITY ⚜</p>
                    <p className="small-text">M3.025 - The Emperor Protects the Vigilant</p>
                </div>
            </section>
        </div>
    );
}
