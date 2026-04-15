import React from 'react';
import {faAngleDown, faAngleUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const SummaryTotals = ({activeMonthData}) => {
    if (!activeMonthData) return null;

    return (
        <div className="tx-summary-totals">
            <div className="tx-total-val income">
                <div className="tx-arrow">
                    <FontAwesomeIcon icon={faAngleUp}/>
                </div>
                Income: +{activeMonthData.income.toFixed(2)} CZK
            </div>
            <div className="tx-total-val expense">
                <div className="tx-arrow">
                    <FontAwesomeIcon icon={faAngleDown}/>
                </div>
                Expenses: -{activeMonthData.expense.toFixed(2)} CZK
            </div>
        </div>
    );
};