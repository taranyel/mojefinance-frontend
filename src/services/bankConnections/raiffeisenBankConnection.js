import axiosClient from '../../api/axiosClient';
import {API_CONFIG} from "../../constants";

export const handleRaiffeisenBankConnection = async (bank) => {
    try {
        const response = await axiosClient.post(
            API_CONFIG.ENDPOINTS.BANK_CONNECT,
            {
                clientRegistrationId: bank.id,
                bankName: bank.name
            }
        );

        return response.data;
    } catch (error) {
        console.error(`Failed to connect to ${bank.name}:`, error);
        throw error;
    }
};