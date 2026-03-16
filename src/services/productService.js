import axiosClient from '../api/axiosClient';
import {API_CONFIG} from "../constants";

export const fetchProducts = async () => {
    const response = await axiosClient.get(API_CONFIG.ENDPOINTS.PRODUCTS);
    console.log(response.data);
    return response.data.products;
};