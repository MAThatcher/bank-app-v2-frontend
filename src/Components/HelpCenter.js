import React from "react";
import "../Css/HelpCenter.css";

const HelpCenter = () => {
  return (
    <div className="help-center-container">
      <h1 className="help-center-title">Help Center</h1>
      <p className="help-center-intro">
        Welcome to the [Your Company Name] Help Center. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Browse through our frequently asked questions (FAQ) or contact us if you need further assistance.
      </p>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>What is [Your Company Name]?</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus fermentum id urna in tincidunt.</p>
        </div>
        <div className="faq-item">
          <h3>How can I create an account?</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. To create an account, click the "Sign Up" button 
            on the homepage and follow the instructions.
          </p>
        </div>
        <div className="faq-item">
          <h3>How do I reset my password?</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Click on the "Forgot Password" link on the login 
            page, and follow the steps to reset your password.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I update my account information?</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Yes, you can update your account information by 
            navigating to the "Profile" section in your account dashboard.
          </p>
        </div>
        <div className="faq-item">
          <h3>What payment methods are accepted?</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. We accept credit cards, PayPal, and other 
            electronic payment methods.
          </p>
        </div>
        <div className="faq-item">
          <h3>How do I contact customer support?</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. You can contact our support team by clicking on 
            the "Contact Us" button below.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <h2>Need More Help?</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. If you didn’t find the answer you were looking for, 
          feel free to reach out to us.
        </p>
        {/* <a href="mailto:support@example.com" className="contact-link">Contact Us</a> */}
      </section>
    </div>
  );
};

export default HelpCenter;
