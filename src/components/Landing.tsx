import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export const Landing: React.FC = () => {
  return (
    <div className="landing">
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">
            Welcome to Crypto Wallet
          </h1>
          <p className="landing-subtitle">
            Secure, simple, and powerful cryptocurrency wallet management
          </p>
          
          <div className="features">
            <div className="feature">
              <div className="feature-icon">🔐</div>
              <h3>Secure</h3>
              <p>Your private keys are encrypted and stored safely</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Fast</h3>
              <p>Lightning-fast transactions on the blockchain</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📱</div>
              <h3>Simple</h3>
              <p>Easy-to-use interface for managing your crypto</p>
            </div>
          </div>
          
          <div className="landing-actions">
            <Link to="/register" className="cta-button primary">
              Get Started
            </Link>
            <Link to="/login" className="cta-button secondary">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};