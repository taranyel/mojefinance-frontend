import {useState, useEffect, useRef} from 'react';
import axiosClient from '../api/axiosClient';
import {API_CONFIG} from '../constants';
import {
    parseBanksFromResponse,
    mapBackendBankToComponent,
    getPreviouslyConnectedBanks,
    savePreviouslyConnectedBanks,
    detectDisconnectedBanks,
    mergeWithDisconnectedBanks,
} from '../utils';

/**
 * Hook to fetch connected banks from API
 * Detects disconnected banks by comparing with previous state
 * Preserves user-removed banks in localStorage to avoid re-showing them
 * @returns {object} { connectedBanks, loading, error }
 */
export const useFetchConnectedBanks = () => {
    const [connectedBanks, setConnectedBanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;

        const fetchBanks = async () => {
            try {
                const response = await axiosClient.get(API_CONFIG.ENDPOINTS.BANKS);
                const banksData = parseBanksFromResponse(response.data);

                // Map backend response (all returned banks are connected)
                const mappedBanks = banksData.map((bank) =>
                    mapBackendBankToComponent(bank, 'connected')
                );

                // Get previously connected banks from localStorage
                const previousBanks = getPreviouslyConnectedBanks();

                // Detect banks that were connected but are now disconnected
                // This includes banks that expired AND banks that were removed by user
                const disconnectedBanks = detectDisconnectedBanks(
                    mappedBanks,
                    previousBanks
                );

                // Merge connected and disconnected banks
                const allBanks = mergeWithDisconnectedBanks(
                    mappedBanks,
                    disconnectedBanks
                );

                // Save ALL banks (connected + disconnected) for next comparison
                // This preserves the state so removed banks don't reappear
                const banksCombined = [...mappedBanks, ...disconnectedBanks];
                savePreviouslyConnectedBanks(banksCombined);

                setConnectedBanks(allBanks);
                setError(null);
            } catch (err) {
                console.error('Error fetching connected banks:', err);
                setError(err.message);
                setConnectedBanks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchedRef.current = true;
        fetchBanks();
    }, []);

    return {connectedBanks, loading, error};
};



