import React from 'react';
import PropTypes from 'prop-types';
import { handleLogoError } from '../utils';
import '../styles/Accounts.css';

const ProductCard = ({ product }) => {
    const {
        accountName,
        productCategory,
        balance,
        bankDetails,
        productIdentification,
        ownersNames
    } = product;

    const formattedBalance = balance?.value !== undefined
        ? balance.value + ' ' + balance.currency
        : 'Balance unavailable';

    return (
        <div className="product-card">
            <div className="product-header-row">
                <img
                    src={`/bank-logos/${bankDetails.clientRegistrationId}.png`}
                    alt={`${bankDetails.bankName || 'Bank'} Logo`}
                    className="product-bank-logo"
                    onError={handleLogoError}
                />
                <div className="product-header-text">
                    <h3 className="product-account-name">{accountName || 'Unnamed Account'}</h3>
                    <p className="product-category">{productCategory || 'Account'}</p>
                </div>
            </div>

            <p className="data-label">Balance</p>
            <h2 className="main-balance-amount">{formattedBalance}</h2>

            <div className="divider"></div>

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
                    <p className="detail-value">{ownersNames?.join(', ') || 'Unknown'}</p>
                </div>
            </div>

        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        productId: PropTypes.string.isRequired,
        accountName: PropTypes.string,
        productCategory: PropTypes.string,
        balance: PropTypes.shape({
            value: PropTypes.number,
            currency: PropTypes.string,
        }),
        bankDetails: PropTypes.shape({
            clientRegistrationId: PropTypes.string.isRequired,
            bankName: PropTypes.string,
        }).isRequired,
        productIdentification: PropTypes.shape({
            iban: PropTypes.string,
            productNumber: PropTypes.string,
        }),
        ownersNames: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default ProductCard;