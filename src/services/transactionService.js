import axiosClient from '../api/axiosClient';
import { API_CONFIG } from "../constants";

export const fetchTransactions = async (accountId, clientRegistrationId, fromDate, toDate) => {
    const response = await axiosClient.get(
        API_CONFIG.ENDPOINTS.TRANSACTIONS(clientRegistrationId, accountId),
        {
            params: { fromDate, toDate }
        }
    );
    console.log(response);
    return response.data.groupedByMonth;
};