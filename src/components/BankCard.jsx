/**
 * BankCard Component
 * Displays a single connected bank card with status and actions
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { handleLogoError } from '../utils';

const BankCard = ({ bank, onDisconnect, onConnectAgain }) => {
    const isDisconnected = bank.status === 'DISCONNECTED';

    const handleDisconnectClick = useCallback(() => {
        onDisconnect(bank.id, bank.name);
    }, [bank.id, bank.name, onDisconnect]);

    const handleConnectAgainClick = useCallback(() => {
        onConnectAgain(bank);
    }, [bank, onConnectAgain]);

    return (
        <div className={`bank-card ${isDisconnected ? 'bank-card--disconnected' : ''}`}>
            <div className="bank-header-row">
                <img
                    className="bank-logo"
                    src={`/bank-logos/${bank.id}.png`}
                    alt={`${bank.name || 'Bank'} Logo`}
                    onError={handleLogoError}
                />
                <h3 className="bank-name">{bank.name}</h3>
            </div>

            <div className="bank-status">
                Connection status: <strong>{bank.status}</strong>
                <span className={`status-dot status-dot--${bank.status.toLowerCase()}`}></span>
            </div>

            {isDisconnected ? (
                <div className="bank-card__actions">
                    <button
                        className="btn-connect-again"
                        onClick={handleConnectAgainClick}
                        aria-label={`Connect ${bank.name} again`}
                    >
                        Connect again
                    </button>
                    <button
                        className="btn-remove-bank"
                        onClick={handleDisconnectClick}
                        aria-label={`Remove ${bank.name}`}
                    >
                        Remove bank
                    </button>
                </div>
            ) : (
                <button
                    className="btn-disconnect"
                    onClick={handleDisconnectClick}
                    aria-label={`Disconnect ${bank.name}`}
                >
                    Disconnect
                </button>
            )}
        </div>
    );
};

BankCard.propTypes = {
    bank: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
    }).isRequired,
    onDisconnect: PropTypes.func.isRequired,
    onConnectAgain: PropTypes.func.isRequired,
};

export default BankCard;

