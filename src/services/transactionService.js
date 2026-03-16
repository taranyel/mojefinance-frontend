import axiosClient from '../api/axiosClient';
import { API_CONFIG } from "../constants";

export const fetchTransactions = async (accountId, clientRegistrationId) => {
    const response = await axiosClient.get(
        API_CONFIG.ENDPOINTS.TRANSACTIONS(accountId),
        {
            params: { clientRegistrationId }
        }
    );
    console.log(response);
    return response.data.groupedByMonth;
};