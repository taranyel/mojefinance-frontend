import React from 'react';
import { handleLogoError } from '../utils';

const AccountItem = ({ product, groupName, formattedBalance }) => {
    return (
        <div className="account-item">
            <img
                src={`/bank-logos/${product.bankDetails?.clientRegistrationId}.png`}
                alt={`${product.bankDetails?.bankName || 'Bank'} Logo`}
                className="product-bank-logo"
                onError={handleLogoError}
            />
            <div className="account-details">
                <span className="acc-name">{product.accountName || 'Unknown Account'}</span>
                <span className="acc-type">{groupName}</span>
            </div>
            <div className="acc-amount">
                {formattedBalance}
            </div>
        </div>
    );
};

export default AccountItem;