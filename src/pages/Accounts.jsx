import React, { useState, useEffect, useRef } from 'react';
import { fetchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import '../styles/Accounts.css';

const Accounts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // New state for the active filter
    const [selectedBank, setSelectedBank] = useState('All');

    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts();
                setProducts(data || []);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Could not load your accounts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return (
            <div className="accounts-container">
                <div className="loading-message">Loading your accounts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="accounts-container">
                <div className="error-message" style={{ color: 'red' }}>{error}</div>
            </div>
        );
    }

    // 1. Generate a unique list of bank names from the fetched products
    const uniqueBanks = ['All', ...new Set(products.map(p => p.bankDetails?.bankName || 'Unknown Bank'))];

    // 2. Filter the products based on the selected dropdown value
    const filteredProducts = selectedBank === 'All'
        ? products
        : products.filter(p => (p.bankDetails?.bankName || 'Unknown Bank') === selectedBank);

    return (
        <div className="accounts-container">

            {/* Filter Controls Row */}
            {products.length > 0 && (
                <div className="accounts-filter-row">
                    <label htmlFor="bank-filter">Filter by Bank:</label>
                    <select
                        id="bank-filter"
                        className="accounts-select"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                    >
                        {uniqueBanks.map(bank => (
                            <option key={bank} value={bank}>{bank}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Display Logic */}
            {products.length === 0 ? (
                <div className="empty-message">You haven't connected any bank accounts yet.</div>
            ) : filteredProducts.length === 0 ? (
                <div className="empty-message">No accounts found for {selectedBank}.</div>
            ) : (
                <div className="accounts-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Accounts;