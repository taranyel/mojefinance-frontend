import axiosClient from '../api/axiosClient';
import { API_CONFIG } from '../constants';

export const fetchProducts = async () => {
    const response = await axiosClient.get(API_CONFIG.ENDPOINTS.PRODUCTS);
    return response.data.products;
};

export const fetchAssetsAndLiabilities = async () => {
    const response = await axiosClient.get(API_CONFIG.ENDPOINTS.ASSETS_LIABILITIES);
    console.log(response.data)
    return response.data;
};

export const fetchCashFlow = async () => {
    const response = await axiosClient.get(API_CONFIG.ENDPOINTS.CASH_FLOW);
    return response.data;
};