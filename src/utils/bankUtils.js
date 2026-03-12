/**
 * Bank Utilities
 * Helper functions for bank operations
 */

import { AVAILABLE_BANKS } from '../constants';

/**
 * Find bank configuration by ID
 * @param {string} bankId - Bank ID
 * @returns {object|undefined} Bank configuration
 */
export const getBankById = (bankId) => {
    return AVAILABLE_BANKS.find((bank) => bank.id === bankId);
};

/**
 * Find bank configuration by name (case-insensitive)
 * @param {string} bankName - Bank name
 * @returns {object|undefined} Bank configuration
 */
export const getBankByName = (bankName) => {
    return AVAILABLE_BANKS.find(
        (bank) => bank.name.toLowerCase() === bankName.toLowerCase()
    );
};

/**
 * Map backend bank response to component structure
 * @param {object} bankData - Backend bank data
 * @returns {object} Mapped bank data
 */
export const mapBackendBankToComponent = (bankData) => {
    return {
        id: bankData.clientRegistrationId,
        name: bankData.bankName,
        status: bankData.bankConnectionStatus,
        logoUrl: bankData.logoUrl,
    };
};

/**
 * Parse banks from API response (handles different response formats)
 * @param {object} response - API response
 * @returns {array} Array of banks
 */
export const parseBanksFromResponse = (response) => {
    if (!response) return [];

    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response.connectedBanks)) {
        return response.connectedBanks;
    }

    if (Array.isArray(response.banks)) {
        return response.banks;
    }

    return [];
};

/**
 * Filter out already connected banks from available banks
 * @param {array} availableBanks - List of available banks
 * @param {array} connectedBanks - List of connected banks
 * @returns {array} Available banks that are not connected
 */
export const getAvailableBanksToConnect = (availableBanks, connectedBanks) => {
    return availableBanks.filter(
        (bank) => !connectedBanks.some((connected) => connected.id === bank.id)
    );
};

/**
 * Get all available banks
 * @returns {array} List of all available banks
 */
export const getAllAvailableBanks = () => {
    return AVAILABLE_BANKS;
};


