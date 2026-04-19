/**
 * BankSelectionModal Component
 * Modal for selecting a bank to connect
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { UI_CONFIG, AVAILABLE_BANKS } from '../constants';
import { getAvailableBanksToConnect, handleLogoError } from '../utils';

const BankSelectionModal = ({ isOpen, onClose, connectedBanks, onSelectBank }) => {
    if (!isOpen) return null;

    const availableBanks = getAvailableBanksToConnect(AVAILABLE_BANKS, connectedBanks);

    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const handleBankSelect = useCallback((bank) => {
        onClose();
        onSelectBank(bank);
    }, [onClose, onSelectBank]);

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Select a bank to connect</h2>
                    <button
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        {UI_CONFIG.MODAL_CLOSE_BUTTON}
                    </button>
                </div>

                <div className="modal-banks-grid">
                    {availableBanks.map((bank) => (
                        <div
                            key={bank.id}
                            className="modal-bank-option"
                            onClick={() => handleBankSelect(bank)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleBankSelect(bank);
                                }
                            }}
                        >
                            <img
                                className={`bank-logo ${bank.class}`}
                                src={`/bank-logos/${bank.id}.png`}
                                alt={`${bank.name || 'Bank'} Logo`}
                                onError={handleLogoError}
                            />
                            <p className="bank-name">{bank.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

BankSelectionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    connectedBanks: PropTypes.array.isRequired,
    onSelectBank: PropTypes.func.isRequired,
};

export default BankSelectionModal;