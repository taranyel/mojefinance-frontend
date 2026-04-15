import React from 'react';
import PropTypes from 'prop-types';
import { TransactionItem } from './TransactionItem';

const TransactionList = ({ groupedTransactions, isLoading, filterTransaction, formatAmount }) => {
    if (isLoading) {
        return <div className="tx-message">Loading transactions...</div>;
    }

    if (groupedTransactions.length === 0) {
        return <div className="tx-message">No transactions found for the selected period.</div>;
    }

    return (
        <div className="tx-list">
            {groupedTransactions.map((month, mIdx) => (
                <div key={`month-${mIdx}`} className="tx-month-group">
                    <h5 className="tx-month-title">{month.groupName}</h5>

                    {month.groupedTransactions && month.groupedTransactions.length > 0 ? (
                        month.groupedTransactions.map((category, cIdx) => (
                            <React.Fragment key={`cat-${mIdx}-${cIdx}`}>
                                {category.transactions
                                    ?.filter(filterTransaction)
                                    .map((tx, tIdx) => (
                                        <TransactionItem
                                            key={`tx-${mIdx}-${cIdx}-${tIdx}`}
                                            transaction={tx}
                                            categoryName={category.groupName}
                                            formatAmount={formatAmount}
                                        />
                                    ))}
                            </React.Fragment>
                        ))
                    ) : (
                        month.transactions
                            ?.filter(filterTransaction)
                            .map((tx, tIdx) => {
                                const catName = tx.category || tx.categoryName || 'Other';
                                return (
                                    <TransactionItem
                                        key={`tx-${mIdx}-flat-${tIdx}`}
                                        transaction={tx}
                                        categoryName={catName}
                                        formatAmount={formatAmount}
                                    />
                                );
                            })
                    )}
                </div>
            ))}
        </div>
    );
};

TransactionList.propTypes = {
    groupedTransactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    isLoading: PropTypes.bool.isRequired,
    filterTransaction: PropTypes.func.isRequired,
    formatAmount: PropTypes.func.isRequired,
};

export default TransactionList;

