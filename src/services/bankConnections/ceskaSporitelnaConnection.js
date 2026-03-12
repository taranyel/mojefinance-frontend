/**
 * Česká spořitelna (ČSAS) Bank Connection Handler
 * Handles OAuth2 flow specific to Česká spořitelna
 */
import {API_CONFIG} from '../../constants';

export const handleCeskaSporitelnaConnection = (bank) => {
    const authUrl = import.meta.env.VITE_CSAS_AUTH_URL;
    const clientId = import.meta.env.VITE_CSAS_CLIENT_ID;
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
 * Process callback from Česká spořitelna
 */
export const processCeskaSporitelnaCallback = async (bankId, code, axiosClient, token) => {
    if (!code || !token) {
        throw new Error('Missing authorization code or token');
    }

    const response = await axiosClient.post(
        API_CONFIG.ENDPOINTS.BANK_CONNECT,
        {
            clientRegistrationId: bankId,
            bankName: "Ceska Sporitelna"
        },
        {
            params: { code }
        }
    );

    return response.data;
};

