import React from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard-grid">
            {/* Top Row: Assets & Liabilities */}
            <div className="dashboard-row">
                <div className="card-widget assets-card">
                    <h3>Total Assets</h3>
                    <div className="amount-large">CZK 50,000.00</div>

                    <div className="account-item">
                        <div className="icon-box blue">S</div>
                        <div className="account-details">
                            <span className="acc-name">Personal account</span>
                            <span className="acc-type">Checking Account</span>
                        </div>
                        <div className="acc-amount">CZK 10,000.00</div>
                    </div>

                    <div className="account-item">
                        <div className="icon-box cyan">CS</div>
                        <div className="account-details">
                            <span className="acc-name">My savings</span>
                            <span className="acc-type">Savings Account</span>
                        </div>
                        <div className="acc-amount">CZK 20,000.00</div>
                    </div>
                </div>

                <div className="card-widget liabilities-card">
                    <h3>Total Liabilities</h3>
                    <div className="amount-large">CZK 30,000.00</div>

                    <div className="account-item">
                        <div className="icon-box blue">S</div>
                        <div className="account-details">
                            <span className="acc-name">Credit Card</span>
                            <span className="acc-type">Credit Card Account</span>
                        </div>
                        <div className="acc-amount">CZK 10,000.00</div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Goals Only (Connect Bank removed) */}
            <div className="dashboard-row">
                <div className="card-widget goals-card" style={{gridColumn: 'span 2'}}>
                    <h3>Goals</h3>
                    <div className="goal-row">
                        <div className="goal-icon">✈️</div>
                        <div className="goal-content">
                            <div className="goal-header">
                                <span>Summer vacation</span>
                                <span className="goal-percent">50% reached</span>
                            </div>
                            <div className="progress-bar">
                                <div className="fill" style={{width: '50%'}}></div>
                            </div>
                            <span className="goal-sub">CZK 20,000 out of CZK 40,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;