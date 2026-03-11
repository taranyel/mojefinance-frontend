import axiosClient from '../../api/axiosClient';

export const handleRaiffeisenBankConnection = async (bank) => {
    try {
        const code = import.meta.env.VITE_CSOB_CODE;
        const response = await axiosClient.get('/api/banks/connect/csob', {
            params: {code}
        });

        return response.data;
    } catch (error) {
        console.error(`Failed to connect to ${bank.name}:`, error);
        throw error;
    }
};