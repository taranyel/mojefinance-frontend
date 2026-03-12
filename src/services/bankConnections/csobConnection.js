import axiosClient from '../../api/axiosClient';
import {API_CONFIG} from "../../constants";

export const handleCSOBConnection = async (bank) => {
    try {
        const code = import.meta.env.VITE_CSOB_CODE;
        const response = await axiosClient.post(
            API_CONFIG.ENDPOINTS.BANK_CONNECT,
            {
                clientRegistrationId: bank.id,
                bankName: bank.name
            },
            {
                params: { code }
            }
        );

        return response.data;
    } catch (error) {
        console.error(`Failed to connect to ${bank.name}:`, error);
        throw error;
    }
};