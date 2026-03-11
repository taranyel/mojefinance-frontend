/**
 * AddBankCard Component
 * Card to trigger adding a new bank connection
 */

import React from 'react';
import PropTypes from 'prop-types';

const AddBankCard = ({onClick}) => {
    return (
        <div
            className="add-bank-card"
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            }}
            aria-label="Connect new bank"
        >
            <div className="plus-circle">
                <span className="plus-icon">+</span>
            </div>
            <span className="add-text">Connect new bank</span>
        </div>
    );
};

AddBankCard.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default AddBankCard;

