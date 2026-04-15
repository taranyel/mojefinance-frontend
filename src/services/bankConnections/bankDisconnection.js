import { API_CONFIG } from '../../constants';
import axiosClient from '../../api/axiosClient';

export const disconnectBank = async (bankId) => {
    if (!bankId) {
        throw new Error('Missing bank ID');
    }
    await axiosClient.delete(
        API_CONFIG.ENDPOINTS.BANK_DISCONNECT(bankId),
    );
};