import React from "react";
import "../Style/PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>
      <p className="last-updated">Last updated: October 2025</p>

      <section>
        <h2>1. Introduction</h2>
        <p>
          Welcome to our website. Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use our services.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <ul>
          <li>Personal data (e.g., name, email address, phone number).</li>
          <li>Usage data such as pages visited and actions performed.</li>
          <li>Cookies to improve your browsing experience.</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <p>We use your data to:</p>
        <ul>
          <li>Provide and improve our services.</li>
          <li>Communicate with you about updates or offers.</li>
          <li>Ensure website functionality and security.</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Protection</h2>
        <p>
          We implement technical and organizational measures to safeguard your personal data. However, no online method is completely secure.
        </p>
      </section>

      <section>
        <h2>5. Your Rights</h2>
        <p>
          You can request to view, update, or delete your personal information by contacting us.
        </p>
      </section>

      <section>
        <h2>6. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, message us at:{" "}
          <a href="https://www.instagram.com/eira_website_/">https://www.instagram.com/eira_website_/</a>
        </p>
      </section>
    </div>
  );
}