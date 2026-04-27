import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { BUDGET_CATEGORIES } from '../constants/categories';

const getBudgetPeriod = (startDateStr) => {
    if (!startDateStr) return 'No date set';

    const start = new Date(startDateStr);
    const end = new Date(start);

    const expectedMonth = (start.getMonth() + 1) % 12;
    end.setMonth(start.getMonth() + 1);

    if (end.getMonth() !== expectedMonth) {
        end.setDate(0);
    }

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return `${start.toLocaleDateString(undefined, options)} - ${end.toLocaleDateString(undefined, options)}`;
};

const BudgetCard = ({ budget, formatAmount, onEdit, onDelete }) => {
    const limit = parseFloat(budget.amount?.value || 0);
    const spent = parseFloat(budget.spentAmount?.value || 0);

    const percent = limit > 0 ? Math.min((Math.abs(spent) / Math.abs(limit)) * 100, 100) : 0;
    const isExceeded = budget.budgetStatus === 'EXCEEDED';

    return (
        <div className={`budget-card ${isExceeded ? 'exceeded' : ''}`}>
            <div className="budget-card-top">
                <div>
                    <div className="budget-cat-label">
                        {BUDGET_CATEGORIES.find(c => c.value === budget.category)?.label || budget.category}
                    </div>
                    <div className="budget-dates">
                        {getBudgetPeriod(budget.startDate)}
                    </div>
                </div>
                <div className="budget-actions">
                    <button onClick={() => onEdit(budget)}>
                        <FontAwesomeIcon icon={faPen} />
                    </button>
                    <button onClick={() => onDelete(budget.budgetId)}>
                        <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </div>

            <div className="budget-amounts">
                <span className={`spent ${isExceeded ? 'text-red' : ''}`}>
                    {formatAmount(budget.spentAmount)}
                </span>
                <span className="limit">of {formatAmount(budget.amount)}</span>
            </div>

            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${percent}%` }}></div>
            </div>

            {isExceeded && (
                <div className="exceeded-tag">
                    <FontAwesomeIcon icon={faTriangleExclamation} /> Over budget
                </div>
            )}
        </div>
    );
};

export default BudgetCard;