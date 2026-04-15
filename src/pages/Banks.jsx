import React, { useState, useCallback, useEffect } from 'react';
import '../styles/Banks.css';
import { ERROR_MESSAGES } from '../constants';
import { routeBankConnection } from '../services';
import { useFetchConnectedBanks } from '../hooks';
import BankCard from '../components/BankCard';
import BankSelectionModal from '../components/BankSelectionModal';
import AddBankCard from '../components/AddBankCard';
import { disconnectBank } from '../services/bankConnections/bankDisconnection';

const Banks = () => {
    const { connectedBanks: initialBanks } = useFetchConnectedBanks();
    const [connectedBanks, setConnectedBanks] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setConnectedBanks(initialBanks);
    }, [initialBanks]);

    const handleOpenModal = useCallback(() => {
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
    }, []);

    const handleDisconnect = useCallback((bankId, bankName) => {
        const confirmMessage = ERROR_MESSAGES.DISCONNECT_CONFIRMATION(bankName);
        if (window.confirm(confirmMessage)) {
            console.log('Disconnecting', bankName);
            try {
                disconnectBank(bankId);
                window.location.reload();
            } catch (error) {
                console.error('Bank disconnection error:', error);
                const errorMessage = ERROR_MESSAGES.BANK_DISCONNECTION_FAILED(bankName);
                alert(errorMessage);
            }
        }
    }, []);

    const handleConnectBank = useCallback((bank) => {
        try {
            routeBankConnection(bank);
        } catch (error) {
            console.error('Bank connection error:', error);
            const errorMessage = ERROR_MESSAGES.BANK_CONNECTION_FAILED(bank.name);
            alert(errorMessage);
        }
    }, []);

    return (
        <div className="banks-container">
            <div className="banks-grid">
                {connectedBanks.map((bank) => (
                    <BankCard
                        key={bank.id}
                        bank={bank}
                        onDisconnect={handleDisconnect}
                        onConnectAgain={handleConnectBank}
                    />
                ))}

                <AddBankCard onClick={handleOpenModal}/>
            </div>

            <BankSelectionModal
                isOpen={showModal}
                onClose={handleCloseModal}
                connectedBanks={connectedBanks}
                onSelectBank={handleConnectBank}
            />
        </div>
    );
};

export default Banks;

