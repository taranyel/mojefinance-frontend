/**
 * Bank Logo Error Handler
 * Handles bank logo loading errors with fallback
 */
export const handleLogoError = (e) => {
    e.target.onerror = null;
    e.target.src = '/bank-logos/default-bank.png';
};

