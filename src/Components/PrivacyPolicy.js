import React from "react";
import "../Css/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1 className="privacy-policy-title">Privacy Policy</h1>
      
      <section className="privacy-policy-section">
        <h2>Introduction</h2>
        <p>
          Welcome to [Your Company Name]'s Privacy Policy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          This Privacy Policy explains how we collect, use, and protect your information when you visit our website 
          or use our services.
        </p>
      </section>
      
      <section className="privacy-policy-section">
        <h2>Information We Collect</h2>
        <p>We may collect and process the following types of information:</p>
        <ul>
          <li>Personal information: Lorem ipsum dolor sit amet (e.g., name, email address).</li>
          <li>Account details: Lorem ipsum dolor sit amet (e.g., username, password).</li>
          <li>Payment details: Lorem ipsum dolor sit amet (e.g., billing address, credit card information).</li>
          <li>Usage data: Lorem ipsum dolor sit amet (e.g., browser type, IP address).</li>
        </ul>
      </section>

      <section className="privacy-policy-section">
        <h2>How We Use Your Information</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. We use your information for the following purposes:
        </p>
        <ul>
          <li>To provide and manage our services.</li>
          <li>To communicate with you about your account or transactions.</li>
          <li>To comply with legal obligations.</li>
        </ul>
      </section>

      <section className="privacy-policy-section">
        <h2>How We Protect Your Information</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. We use industry-standard security measures to 
          protect your information from unauthorized access, use, or disclosure.
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>Sharing Your Information</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. We may share your information with third parties 
          for the following purposes:
        </p>
        <ul>
          <li>To comply with legal requirements.</li>
          <li>To provide services on our behalf (e.g., payment processing).</li>
          <li>To protect the rights and safety of our users and others.</li>
        </ul>
      </section>

      <section className="privacy-policy-section">
        <h2>Your Choices</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. You have the right to:
        </p>
        <ul>
          <li>Access and update your personal information.</li>
          <li>Opt out of marketing communications.</li>
          <li>Request the deletion of your data.</li>
        </ul>
      </section>

      <section className="privacy-policy-section">
        <h2>Changes to This Privacy Policy</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. We may update this Privacy Policy from time to time. 
          Any changes will be posted on this page with an updated effective date.
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at email@email.com
          {/* <a href="mailto:contact@example.com"> contact@example.com</a>. */}
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
