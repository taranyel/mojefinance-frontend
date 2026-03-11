import React, {useState, useCallback} from 'react';
import '../styles/Banks.css';
import {ERROR_MESSAGES} from '../constants';
import {routeBankConnection} from '../services';
import {removeBankFromStorage} from '../utils';
import {useFetchConnectedBanks} from '../hooks';
import BankCard from '../components/BankCard';
import BankSelectionModal from '../components/BankSelectionModal';
import AddBankCard from '../components/AddBankCard';

const Banks = () => {
    const { connectedBanks: initialBanks } = useFetchConnectedBanks();
    const [connectedBanks, setConnectedBanks] = useState(initialBanks);
    const [showModal, setShowModal] = useState(false);

    // Update state when initial banks are loaded
    React.useEffect(() => {
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
            console.log("Disconnecting", bankId);
            // TODO: Implement disconnect API call
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

    const handleConnectAgain = useCallback((bank) => {
        try {
            routeBankConnection(bank);
        } catch (error) {
            console.error('Bank reconnection error:', error);
            const errorMessage = ERROR_MESSAGES.BANK_CONNECTION_FAILED(bank.name);
            alert(errorMessage);
        }
    }, []);


    const handleRemoveBank = useCallback((bankId, bankName) => {
        const confirmMessage = `Are you sure you want to permanently remove ${bankName}?`;
        if (window.confirm(confirmMessage)) {
            // Remove bank from state
            setConnectedBanks((prevBanks) =>
                prevBanks.filter((bank) => bank.id !== bankId)
            );

            // Remove bank from localStorage
            removeBankFromStorage(bankId);

            console.log("Bank removed", bankId);
            // TODO: Implement remove bank API call
        }
    }, []);

    return (
        <div className="banks-container">
            <div className="banks-grid">
                {/* Render Connected Banks */}
                {connectedBanks.map((bank) => (
                    <BankCard
                        key={bank.id}
                        bank={bank}
                        onDisconnect={handleDisconnect}
                        onConnectAgain={handleConnectAgain}
                        onRemoveBank={handleRemoveBank}
                    />
                ))}

                {/* Add Bank Card */}
                <AddBankCard onClick={handleOpenModal}/>
            </div>

            {/* Bank Selection Modal */}
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

