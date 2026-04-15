import React, {useState, useEffect, useRef, useCallback} from 'react';
import {fetchProducts} from '../services/productService';
import ProductCard from '../components/ProductCard';
import '../styles/Accounts.css';

const Accounts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    const handleBankFilterChange = useCallback((e) => {
        setSelectedBank(e.target.value);
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
                <div className="error-message" style={{color: 'red'}}>{error}</div>
            </div>
        );
    }

    const uniqueBanks = ['All', ...new Set(products.map(p => p.bankDetails?.bankName || 'Unknown Bank'))];

    const filteredProducts = selectedBank === 'All'
        ? products
        : products.filter(p => (p.bankDetails?.bankName || 'Unknown Bank') === selectedBank);

    return (
        <div className="accounts-container">
            {products.length > 0 && (
                <div className="accounts-filter-row">
                    <label htmlFor="bank-filter">Filter by Bank:</label>
                    <select
                        id="bank-filter"
                        className="accounts-select"
                        value={selectedBank}
                        onChange={handleBankFilterChange}
                    >
                        {uniqueBanks.map(bank => (
                            <option key={bank} value={bank}>{bank}</option>
                        ))}
                    </select>
                </div>
            )}

            {products.length === 0 ? (
                <div className="empty-message">You haven't connected any bank accounts yet.</div>
            ) : filteredProducts.length === 0 ? (
                <div className="empty-message">No accounts found for {selectedBank}.</div>
            ) : (
                <div className="accounts-grid">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.productId} product={product}/>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Accounts;