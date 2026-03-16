import React from 'react';
import '../styles/Accounts.css';

const ProductCard = ({ product }) => {
    // Safely extract properties based on your OpenAPI schema
    const {
        accountName,
        productCategory,
        balance,
        bankDetails,
        productIdentification,
        ownersNames
    } = product;

    // Format the currency nicely (e.g., 10 500.00 CZK)
    const formattedBalance = balance?.value !== undefined
        ? balance.value + ' ' + balance.currency
        : 'Balance unavailable';

    return (
        <div className="product-card">

            {/* 1. Header with Logo and Titles */}
            <div className="product-header-row">
                {/* Replace src with your actual bank logo logic */}
                <img src="/bank-logo-placeholder.png" alt="Bank Logo" className="product-bank-logo" />
                <div className="product-header-text">
                    <h3 className="product-account-name">{accountName || 'Unnamed Account'}</h3>
                    <p className="product-category">{productCategory || 'Account'}</p>
                </div>
            </div>

            {/* 2. Main Balance */}
            <p className="data-label">Balance</p>
            <h2 className="main-balance-amount">{formattedBalance}</h2>

            {/* 3. Divider Line */}
            <div className="divider"></div>

            {/* 4. Details Stack */}
            <div className="details-stack">
                <div className="detail-item">
                    <p className="data-label">IBAN</p>
                    <p className="detail-value">{productIdentification?.iban || 'N/A'}</p>
                </div>

                <div className="detail-item">
                    <p className="data-label">Account number</p>
                    <p className="detail-value">{productIdentification?.productNumber || 'N/A'}</p>
                </div>

                <div className="detail-item">
                    <p className="data-label">Account owner</p>
                    {/* Join the array of owners if it exists, otherwise fallback */}
                    <p className="detail-value">{ownersNames?.join(', ') || 'Unknown'}</p>
                </div>
            </div>

        </div>
    );
};

export default ProductCard;