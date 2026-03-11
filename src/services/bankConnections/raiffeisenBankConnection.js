/**
 * Raiffeisenbank Connection Handler
 * Handles OAuth2 flow specific to Raiffeisenbank
 */

export const handleRaiffeisenBankConnection = (bank) => {
    const authUrl = import.meta.env.VITE_RB_AUTH_URL;
    const clientId = import.meta.env.VITE_RB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/bank-callback`;
    const state = 'random_security_string';

    sessionStorage.setItem('selectedBank', bank.id);

    const params = new URLSearchParams({
        redirect_uri: redirectUri,
        client_id: clientId,
        response_type: 'code',
        state: state,
        access_type: 'offline'
    });

    window.location.href = `${authUrl}?${params.toString()}`;
};

/**
 * Process callback from Raiffeisenbank
 */
export const processRaiffeisenBankCallback = async (code, axiosClient, token) => {
    if (!code || !token) {
        throw new Error('Missing authorization code or token');
    }

    const response = await axiosClient.get('/api/banks/connect/reiffeisen-bank', {
        params: {code},
        headers: {'Authorization': `Bearer ${token}`}
    });

    return response.data;
};

