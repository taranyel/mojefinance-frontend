/**
 * Komerční banka (KB) Connection Handler
 * Handles OAuth2 flow specific to KB
 */

export const handleKBConnection = (bank) => {
    const authUrl = import.meta.env.VITE_KB_AUTH_URL;
    const clientId = import.meta.env.VITE_KB_CLIENT_ID;
    const scope = import.meta.env.VITE_KB_SCOPE;
    const redirectUri = `${window.location.origin}/bank-callback`;
    const state = 'random_security_string';

    sessionStorage.setItem('selectedBank', bank.id);

    const params = new URLSearchParams({
        redirect_uri: redirectUri,
        client_id: clientId,
        response_type: 'code',
        state: state,
        access_type: 'offline',
        scope: scope
    });

    window.location.href = `${authUrl}?${params.toString()}`;
};

/**
 * Process callback from KB
 */
export const processKBCallback = async (code, axiosClient, token) => {
    if (!code || !token) {
        throw new Error('Missing authorization code or token');
    }

    const response = await axiosClient.get('/api/banks/connect/kb', {
        params: {code},
        headers: {'Authorization': `Bearer ${token}`}
    });

    return response.data;
};

