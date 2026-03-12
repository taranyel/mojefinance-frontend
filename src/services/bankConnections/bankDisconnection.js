import {API_CONFIG} from "../../constants";
import axiosClient from "../../api/axiosClient";

export const disconnectBank = async (bankId, token) => {
    if (!token) {
        throw new Error('Missing authorization token');
    }
    await axiosClient.delete(
        API_CONFIG.ENDPOINTS.BANK_DISCONNECT(bankId),
    );
};