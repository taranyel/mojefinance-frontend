import {useState, useEffect, useRef} from 'react';
import axiosClient from '../api/axiosClient';
import {API_CONFIG} from '../constants';
import {
    parseBanksFromResponse,
    mapBackendBankToComponent
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

                const mappedBanks = banksData.map((bank) =>
                    mapBackendBankToComponent(bank)
                );

                setConnectedBanks(mappedBanks);
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



