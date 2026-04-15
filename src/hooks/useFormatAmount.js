/**
 * Hook for formatting amount objects
 * @returns {string} Formatted amount string
 */
export const useFormatAmount = () => {
    return (balance) => {
        if (!balance || balance.value === undefined) {
            return 'Balance unavailable';
        }
        return `${balance.value} ${balance.currency || 'CZK'}`;
    };
};

