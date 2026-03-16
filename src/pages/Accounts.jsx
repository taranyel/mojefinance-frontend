import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import '../styles/Accounts.css';

const Accounts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts();
                setProducts(data);
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
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="accounts-container">
                <div className="empty-message">You haven't connected any bank accounts yet.</div>
            </div>
        );
    }

    return (
        <div className="accounts-container">
            <div className="accounts-grid">
                {products.map((product) => (
                    <ProductCard key={product.productId} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Accounts;

