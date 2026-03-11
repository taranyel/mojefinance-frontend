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
 * @param {string} status - Connection status (default: 'connected')
 * @returns {object} Mapped bank data
 */
export const mapBackendBankToComponent = (bankData, status = 'connected') => {
    const bankConfig = getBankByName(bankData.name);

    return {
        id: bankConfig?.id || bankData.name.toLowerCase().replace(/\s+/g, '-'),
        name: bankData.name,
        status: status, // Backend returns connected banks only, so default is 'connected'
        logo: bankConfig?.logo || bankData.name.charAt(0).toUpperCase(),
        class: bankConfig?.class || 'logo-default',
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

    // Handle direct array response
    if (Array.isArray(response)) {
        return response;
    }

    // Handle object response with various wrapper properties
    if (Array.isArray(response.connectedBanks)) {
        return response.connectedBanks;
    }

    if (Array.isArray(response.banks)) {
        return response.banks;
    }

    // Default to empty array
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

/**
 * Get previously connected banks from localStorage
 * @returns {array} Previously connected banks
 */
export const getPreviouslyConnectedBanks = () => {
    try {
        const stored = localStorage.getItem('previouslyConnectedBanks');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading previously connected banks:', error);
        return [];
    }
};

/**
 * Save currently connected banks to localStorage
 * @param {array} banks - Currently connected banks
 */
export const savePreviouslyConnectedBanks = (banks) => {
    try {
        localStorage.setItem('previouslyConnectedBanks', JSON.stringify(banks));
    } catch (error) {
        console.error('Error saving previously connected banks:', error);
    }
};

/**
 * Detect disconnected banks by comparing with previous state
 * @param {array} currentBanks - Currently connected banks from backend
 * @param {array} previousBanks - Previously connected banks
 * @returns {array} Banks that were connected but are now disconnected
 */
export const detectDisconnectedBanks = (currentBanks, previousBanks) => {
    if (!previousBanks || previousBanks.length === 0) {
        return []; // First load, no previous state
    }

    const currentBankIds = new Set(currentBanks.map((bank) => bank.id));

    return previousBanks.filter((prevBank) => !currentBankIds.has(prevBank.id));
};

/**
 * Remove a bank from localStorage
 * @param {string} bankId - Bank ID to remove
 */
export const removeBankFromStorage = (bankId) => {
    try {
        const previousBanks = getPreviouslyConnectedBanks();
        const updatedBanks = previousBanks.filter((bank) => bank.id !== bankId);
        savePreviouslyConnectedBanks(updatedBanks);
    } catch (error) {
        console.error('Error removing bank from storage:', error);
    }
};

/**
 * Merge connected and disconnected banks
 * Disconnected banks show as expired/disconnected
 * @param {array} connectedBanks - Currently connected banks
 * @param {array} disconnectedBanks - Previously connected but now disconnected banks
 * @returns {array} Merged banks with proper status
 */
export const mergeWithDisconnectedBanks = (connectedBanks, disconnectedBanks) => {
    // Mark disconnected banks with 'disconnected' status
    const disconnectedWithStatus = disconnectedBanks.map((bank) => ({
        ...bank,
        status: 'disconnected',
    }));

    // Combine connected and disconnected banks
    return [...connectedBanks, ...disconnectedWithStatus];
};

