import React from 'react';

const ConnectBank = () => {
    const handleConnect = () => {
        // Configuration
        const clientId = '40d9da48-2e4a-4281-b0b8-8dc88491a7a8';
        const redirectUri = 'http://localhost:5173/bank-callback'; // Points to React Route
        const state = 'random_security_string'; // In prod, generate this randomly

        // Authorization URL for Ceska Sporitelna Sandbox
        const authUrl = `https://webapi.developers.erstegroup.com/api/csas/sandbox/v1/sandbox-idp/auth?` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `client_id=${clientId}&` +
            `response_type=code&` +
            `state=${state}&` +
            `access_type=offline`;

        // Redirect the user
        window.location.href = authUrl;
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Connect a Bank</h2>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '400px' }}>
                <h3>Česká spořitelna</h3>
                <p>Sandbox Environment</p>
                <button
                    onClick={handleConnect}
                    style={{ background: '#0061A0', color: 'white', padding: '10px 20px', cursor: 'pointer' }}
                >
                    Connect CSAS
                </button>
            </div>
        </div>
    );
};

export default ConnectBank;