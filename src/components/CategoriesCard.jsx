import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';

export const CategoriesCard = ({ categories, formatAmount }) => {
    if (!categories || categories.length === 0) {
        return (
            <div className="tx-categories-card">
                <div style={{ color: '#a0aec0', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                    No transactions this month
                </div>
            </div>
        );
    }

    return (
        <div className="tx-categories-card">
            {categories.map((cat, idx) => (
                <div key={idx} className="tx-cat-item">
                    <div className="tx-cat-left">
                        <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                        <span className="tx-cat-name">{cat.name}</span>
                    </div>
                    <div className={`tx-cat-amount ${cat.amount.value < 0 ? 'expense' : 'income'}`}>
                        {formatAmount(cat.amount)}
                    </div>
                </div>
            ))}
        </div>
    );
};