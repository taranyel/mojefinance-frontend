import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';

const TransactionItem = ({ transaction, categoryName, formatAmount }) => {
    const isExpense = transaction.amount?.value < 0;

    return (
        <div className="tx-item">
            <div className="tx-item-left">
                <div className="tx-icon">
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                </div>
                <div className="tx-info">
                    <span className="tx-merchant">{transaction.counterpartyName || 'Unknown'}</span>
                    <span className="tx-meta">
                        {categoryName}
                        {transaction.bookingDate && <span className="tx-date">• {transaction.bookingDate}</span>}
                    </span>
                </div>
            </div>
            <div className={`tx-amount ${isExpense ? 'expense' : 'income'}`}>
                {formatAmount(transaction.amount)}
            </div>
        </div>
    );
};

TransactionItem.propTypes = {
    transaction: PropTypes.shape({
        amount: PropTypes.shape({
            value: PropTypes.number,
            currency: PropTypes.string,
        }),
        counterpartyName: PropTypes.string,
        bookingDate: PropTypes.string,
    }).isRequired,
    categoryName: PropTypes.string.isRequired,
    formatAmount: PropTypes.func.isRequired,
};

export { TransactionItem };

