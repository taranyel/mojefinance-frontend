/**
 * Local Storage Utilities
 */

import { TOKEN_CONFIG } from '../constants';

/**
 * Get token from localStorage
 * @returns {string|null} Access token or null
 */
export const getAccessToken = () => {
    return localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
    return localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
};

/**
 * Save access token to localStorage
 * @param {string} token - Access token to save
 */
export const saveAccessToken = (token) => {
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, token);
};

/**
 * Save refresh token to localStorage
 * @param {string} token - Refresh token to save
 */
export const saveRefreshToken = (token) => {
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, token);
};

/**
 * Clear all auth tokens from localStorage
 */
export const clearTokens = () => {
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
};

