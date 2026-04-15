/**
 * Air Bank Connection Handler
 * Handles OAuth2 flow specific to Air Bank
 */
import {API_CONFIG} from "../../constants";

export const handleAirBankConnection = (bank) => {
    const authUrl = import.meta.env.VITE_AIRBANK_AUTH_URL;
    const redirectUri = `${window.location.origin}/bank-callback`;
    const state = 'random_security_string';

    sessionStorage.setItem('selectedBank', bank.id);

    const params = new URLSearchParams({
        redirectUri: redirectUri,
        state: state
    });


    window.location.href = `${authUrl}?${params.toString()}`;
};

/**
 * Process callback from Air Bank
 */
export const processAirBankCallback = async (bankId, code, axiosClient, token) => {
    if (!code || !token) {
        throw new Error('Missing authorization code or token');
    }

    const response = await axiosClient.post(
        API_CONFIG.ENDPOINTS.BANK_CONNECT,
        {
            clientRegistrationId: bankId,
            bankName: "Air Bank"
        },
        {
            params: { code }
        }
    );

    return response.data;
};

