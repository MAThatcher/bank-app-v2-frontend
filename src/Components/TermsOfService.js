import React from "react";
import "../Css/TermsOfService.css";

const TermsOfService = () => {
  return (
    <div className="terms-of-service-container">
      <h1 className="terms-of-service-title">Terms of Service</h1>

      <section className="terms-of-service-section">
        <h2>Introduction</h2>
        <p>
          Welcome to [Your Company Name]. By accessing or using our services, you agree to be bound by these Terms of Service.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. If you do not agree, please do not use our services.
        </p>
      </section>

      <section className="terms-of-service-section">
        <h2>Eligibility</h2>
        <p>
          You must be at least 18 years old to use our services. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          By using our services, you represent and warrant that you meet these eligibility requirements.
        </p>
      </section>

      <section className="terms-of-service-section">
        <h2>Accounts</h2>
        <p>
          When you create an account with us, you must provide accurate and complete information. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. You are responsible for maintaining the confidentiality of your account credentials.
        </p>
      </section>

      <section className="terms-of-service-section">
        <h2>Prohibited Activities</h2>
        <p>By using our services, you agree not to:</p>
        <ul>
          <li>Engage in illegal activities.</li>
          <li>Violate the intellectual property rights of others.</li>
          <li>Disrupt or interfere with our services or servers.</li>
        </ul>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Violations may result in account termination.</p>
      </section>

      <section className="terms-of-service-section">
        <h2>Termination</h2>
        <p>
          We may terminate or suspend your access to our services at any time without prior notice or liability. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. This may occur if you breach these Terms of Service.
        </p>
      </section>

      <section className="terms-of-service-section">
        <h2>Limitation of Liability</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. To the fullest extent permitted by law, the Company
          shall not be liable for any indirect, incidental, or consequential damages.
        </p>
      </section>

      <section className="terms-of-service-section">
        <h2>Governing Law</h2>
        <p>
          These Terms of Service are governed by the laws of Super Earth. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Any disputes shall be resolved in the courts of Super Earth.
        </p>
      </section>

      <section className="terms-of-service-section">
        <h2>Changes to Terms</h2>
        <p>
          We may update these Terms of Service at any time. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Any changes will
          be posted on this page with an updated effective date. Continued use of our services constitutes acceptance of the changes.
        </p>
      </section>

      <section className="terms-of-service-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at email@email.com
          {/* <a href="mailto:contact@example.com"> contact@example.com</a>. */}
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
