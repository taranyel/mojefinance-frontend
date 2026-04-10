import React, { useState, useEffect, useRef } from 'react';
import { fetchAssetsAndLiabilities } from '../services/productService';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [finances, setFinances] = useState({ assets: [], liabilities: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Track which groups are explicitly COLLAPSED.
    // An empty object means NOTHING is collapsed, so everything is expanded by default.
    const [collapsedAssets, setCollapsedAssets] = useState({});
    const [collapsedLiabilities, setCollapsedLiabilities] = useState({});

    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const loadData = async () => {
            try {
                setLoading(true);
                const data = await fetchAssetsAndLiabilities();
                setFinances(data);
                setError(null);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
                setError("Could not load your financial overview.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const formatAmount = (balance) => {
        return balance?.value !== undefined
            ? balance.value + ' ' + (balance.currency || 'CZK')
            : 'Balance unavailable';
    };

    const calculateTotal = (groups) => {
        if (!groups || groups.length === 0) return 0;
        return groups.reduce((sum, group) => sum + (group.totalAmount?.value || 0), 0);
    };

    const totalAssets = calculateTotal(finances.assets);
    const totalLiabilities = calculateTotal(finances.liabilities);

    // Toggle explicitly flags a group as collapsed
    const toggleAssetGroup = (index) => {
        setCollapsedAssets(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const toggleLiabilityGroup = (index) => {
        setCollapsedLiabilities(prev => ({ ...prev, [index]: !prev[index] }));
    };

    if (loading) {
        return <div className="dashboard-grid"><div className="loading-message">Loading dashboard...</div></div>;
    }

    if (error) {
        return <div className="dashboard-grid"><div className="error-message" style={{ color: 'red' }}>{error}</div></div>;
    }

    return (
        <div className="dashboard-grid">
            {/* Top Row: Assets & Liabilities */}
            <div className="dashboard-row">

                {/* --- ASSETS CARD --- */}
                <div className="card-widget assets-card">
                    <h3>Total Assets</h3>
                    <div className="amount-large">{formatAmount({ value: totalAssets, currency: 'CZK' })}</div>

                    <div className="account-list-scrollable" style={{ marginTop: '16px' }}>
                        {finances.assets.map((group, gIdx) => {
                            // If it is NOT in the collapsed map, it is expanded.
                            const isExpanded = !collapsedAssets[gIdx];

                            return (
                                <div key={`asset-group-${gIdx}`} className="dashboard-group">
                                    <div className="dashboard-group-header" onClick={() => toggleAssetGroup(gIdx)}>
                                        <div className="dashboard-group-title">
                                            <h4>{group.groupName}</h4>
                                            <span className={`dashboard-group-chevron ${isExpanded ? 'expanded' : ''}`}>▶</span>
                                        </div>
                                        <div className="dashboard-group-total">
                                            {formatAmount(group.totalAmount)}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="dashboard-group-content">
                                            {group.products.map(product => (
                                                <div className="account-item" key={product.productId}>
                                                    <img
                                                        src={`/bank-logos/${product.bankDetails.clientRegistrationId}.png`}
                                                        alt={`${product.bankDetails.bankName || 'Bank'} Logo`}
                                                        className="product-bank-logo"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/banks/default-bank.png';
                                                        }}
                                                    />
                                                    <div className="account-details">
                                                        <span className="acc-name">{product.accountName || 'Unknown Account'}</span>
                                                        <span className="acc-type">{group.groupName}</span>
                                                    </div>
                                                    <div className="acc-amount">
                                                        {formatAmount(product.balance)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {finances.assets.length === 0 && (
                            <p style={{ color: '#718096', fontSize: '0.9rem' }}>No assets found.</p>
                        )}
                    </div>
                </div>

                {/* --- LIABILITIES CARD --- */}
                <div className="card-widget liabilities-card">
                    <h3>Total Liabilities</h3>
                    <div className="amount-large">{formatAmount({ value: totalLiabilities, currency: 'CZK' })}</div>

                    <div className="account-list-scrollable" style={{ marginTop: '16px' }}>
                        {finances.liabilities.map((group, gIdx) => {
                            // If it is NOT in the collapsed map, it is expanded.
                            const isExpanded = !collapsedLiabilities[gIdx];

                            return (
                                <div key={`liability-group-${gIdx}`} className="dashboard-group">
                                    <div className="dashboard-group-header" onClick={() => toggleLiabilityGroup(gIdx)}>
                                        <div className="dashboard-group-title">
                                            <h4>{group.groupName}</h4>
                                            <span className={`dashboard-group-chevron ${isExpanded ? 'expanded' : ''}`}>▶</span>
                                        </div>
                                        <div className="dashboard-group-total">
                                            {formatAmount(group.totalAmount)}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="dashboard-group-content">
                                            {group.products.map(product => (
                                                <div className="account-item" key={product.productId}>
                                                    <img
                                                        src={`/bank-logos/${product.bankDetails.clientRegistrationId}.png`}
                                                        alt={`${product.bankDetails.bankName || 'Bank'} Logo`}
                                                        className="product-bank-logo"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/banks/default-bank.png';
                                                        }}
                                                    />
                                                    <div className="account-details">
                                                        <span className="acc-name">{product.accountName || 'Unknown Account'}</span>
                                                        <span className="acc-type">{group.groupName}</span>
                                                    </div>
                                                    <div className="acc-amount">
                                                        {formatAmount(product.balance)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {finances.liabilities.length === 0 && (
                            <p style={{ color: '#718096', fontSize: '0.9rem' }}>No liabilities found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;