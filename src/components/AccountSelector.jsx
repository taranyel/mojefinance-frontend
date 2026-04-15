import React from 'react';
import PropTypes from 'prop-types';

const AccountSelector = ({ selectedAccount, accounts, isDropdownOpen, onDropdownToggle, onAccountChange }) => {
    if (!selectedAccount) return null;

    return (
        <div className="tx-account-selector">
            <div
                className={`tx-selector-box ${isDropdownOpen ? 'active' : ''}`}
                onClick={onDropdownToggle}
            >
                <div className="tx-selector-info">
                    <img
                        src={`/bank-logos/${selectedAccount.bankDetails.clientRegistrationId}.png`}
                        alt={`${selectedAccount.bankDetails.bankName || 'Bank'} Logo`}
                        className="tx-bank-logo"
                    />
                    <div className="tx-acc-details">
                        <h4>{selectedAccount.accountName}</h4>
                        <p>{selectedAccount.productIdentification.iban}</p>
                    </div>
                </div>
                <span className="tx-caret">▼</span>
            </div>

            {isDropdownOpen && (
                <div className="tx-dropdown-list">
                    {accounts.map((acc, idx) => (
                        <div
                            key={idx}
                            className="tx-dropdown-item"
                            onClick={() => onAccountChange(acc)}
                        >
                            <img
                                src={`/bank-logos/${acc.bankDetails.clientRegistrationId}.png`}
                                alt={`${acc.bankDetails.bankName || 'Bank'} Logo`}
                                className="tx-dr-bank-logo"
                            />
                            <div className="tx-acc-details">
                                <h4>{acc.accountName}</h4>
                                <p>{acc.productIdentification.iban}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

AccountSelector.propTypes = {
    selectedAccount: PropTypes.object,
    accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
    isDropdownOpen: PropTypes.bool.isRequired,
    onDropdownToggle: PropTypes.func.isRequired,
    onAccountChange: PropTypes.func.isRequired,
};

export default AccountSelector;

