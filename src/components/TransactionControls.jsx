import React from 'react';
import PropTypes from 'prop-types';

const TransactionControls = ({ activeTab, onTabChange, fromDate, toDate, onFromDateChange, onToDateChange }) => {
    return (
        <div className="tx-controls-row">
            <div className="tx-tabs">
                {['All', 'Expenses', 'Income'].map(tab => (
                    <button
                        key={tab}
                        className={`tx-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => onTabChange(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="tx-date-filters">
                <div className="tx-date-input">
                    <label>From</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => onFromDateChange(e.target.value)}
                    />
                </div>
                <div className="tx-date-input">
                    <label>To</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => onToDateChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

TransactionControls.propTypes = {
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
    fromDate: PropTypes.string.isRequired,
    toDate: PropTypes.string.isRequired,
    onFromDateChange: PropTypes.func.isRequired,
    onToDateChange: PropTypes.func.isRequired,
};

export default TransactionControls;

