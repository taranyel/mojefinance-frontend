import React from 'react';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-container">
            <div className="hero-section">
                <h1 className="hero-title">Master your money<br/>with MojeFinance.</h1>
                <p className="hero-subtitle">
                    Track all your assets, liabilities, and financial goals in one secure dashboard.
                    Connect your bank accounts and get real-time insights into your net worth.
                </p>
            </div>

            <div className="preview-section">
                <div className="feature-card">
                    <span className="feature-icon">🔒</span>
                    <h3>Secure Connection</h3>
                    <p>Bank-grade security ensures your financial data remains private and protected.</p>
                </div>
                <div className="feature-card">
                    <span className="feature-icon">📊</span>
                    <h3>Real-time Analytics</h3>
                    <p>Visualize your cash flow, track spending habits, and monitor goal progress instantly.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;