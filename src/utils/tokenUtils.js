/**
 * JWT Token Utilities
 */

import {TOKEN_CONFIG} from '../constants';

/**
 * Decode JWT token and extract payload
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
    if (!token) return null;

    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

/**
 * Get token expiration time in milliseconds
 * @param {string} token - JWT token
 * @returns {number|null} Expiration time in ms or null if invalid
 */
export const getTokenExpirationTime = (token) => {
    const payload = decodeToken(token);
    return payload?.exp ? payload.exp * 1000 : null; // Convert to milliseconds
};

/**
 * Check if token is expired (with buffer)
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired or about to expire
 */
export const isTokenExpired = (token) => {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return false;

    // Add buffer to refresh before actual expiration
    return Date.now() >= (expirationTime - TOKEN_CONFIG.EXPIRATION_BUFFER_MS);
};

/**
 * Get remaining time until token expires (in ms)
 * @param {string} token - JWT token
 * @returns {number|null} Remaining time in ms or null if invalid
 */
export const getTokenRemainingTime = (token) => {
    const expirationTime = getTokenExpirationTime(token);
    if (!expirationTime) return null;

    const remaining = expirationTime - Date.now();
    return remaining > 0 ? remaining : 0;
};

