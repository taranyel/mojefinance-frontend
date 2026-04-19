import axiosClient from '../api/axiosClient';
import { API_CONFIG } from '../constants';

/**
 * Fetches all budgets for the user
 * @returns {Promise<Array>} List of budget objects
 */
export const fetchBudgets = async () => {
    const response = await axiosClient.get(API_CONFIG.ENDPOINTS.BUDGETS);
    console.log(response.data.budgets);
    return response.data.budgets;
};

/**
 * Creates a new budget
 * @param {object} budgetData - { category, amount: {value, currency}, startDate }
 * @returns {Promise<object>} Created budget object
 */
export const createBudget = async (budgetData) => {
    const response = await axiosClient.post(API_CONFIG.ENDPOINTS.BUDGETS, budgetData);
    return response.data;
};

/**
 * Updates an existing budget
 * @param {object} budgetData - { budgetId, category, amount: {value, currency}, startDate }
 * @returns {Promise<object>} Updated budget object
 */
export const updateBudget = async (budgetData) => {
    const response = await axiosClient.put(API_CONFIG.ENDPOINTS.BUDGETS, budgetData);
    return response.data;
};

/**
 * Deletes a budget by ID
 * @param {number} budgetId
 */
export const deleteBudget = async (budgetId) => {
    await axiosClient.delete(`${API_CONFIG.ENDPOINTS.BUDGETS}/${budgetId}`);
};