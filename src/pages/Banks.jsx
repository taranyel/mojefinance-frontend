import React from 'react';
import '../styles/Banks.css';

const Banks = () => {
    // Mock Data mimicking the screenshot
    const banks = [
        { id: 1, name: 'Česká spořitelna', logo: 'Š', class: 'logo-csas', status: 'Active' },
        { id: 2, name: 'ČSOB', logo: 'Č', class: 'logo-csob', status: 'Active' },
        { id: 3, name: 'Raiffeisenbank', logo: 'R', class: 'logo-rb', status: 'Active' },
    ];

    const handleDisconnect = (bankName) => {
        if (window.confirm(`Are you sure you want to disconnect ${bankName}?`)) {
            console.log("Disconnecting", bankName);
        }
    };

    const handleConnectNew = () => {
        // This logic mimics the original ConnectBank functionality
        const authUrl = import.meta.env.VITE_CSAS_AUTH_URL;
        const clientId = import.meta.env.VITE_CSAS_CLIENT_ID;
        const redirectUri = `${window.location.origin}/bank-callback`;
        const state = 'random_security_string';

        const params = new URLSearchParams({
            redirect_uri: redirectUri,
            client_id: clientId,
            response_type: 'code',
            state: state,
            access_type: 'offline'
        });

        window.location.href = `${authUrl}?${params.toString()}`;
    };

    return (
        <div className="banks-container">
            <div className="banks-grid">
                {/* Render Connected Banks */}
                {banks.map((bank) => (
                    <div key={bank.id} className="bank-card">
                        <div className="bank-header-row">
                            <div className={`bank-logo ${bank.class}`}>
                                {bank.logo}
                            </div>
                            <h3 className="bank-name">{bank.name}</h3>
                        </div>

                        <div className="bank-status">
                            Connection status: <strong>{bank.status}</strong>
                            <span className="status-dot"></span>
                        </div>

                        <button
                            className="btn-disconnect"
                            onClick={() => handleDisconnect(bank.name)}
                        >
                            Disconnect
                        </button>
                    </div>
                ))}

                {/* Connect New Bank Card */}
                <div className="add-bank-card" onClick={handleConnectNew}>
                    <div className="plus-circle">
                        <span className="plus-icon">+</span>
                    </div>
                    <span className="add-text">Connect new bank</span>
                </div>
            </div>
        </div>
    );
};

export default Banks;