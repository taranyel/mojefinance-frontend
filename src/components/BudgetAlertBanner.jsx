import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { BUDGET_CATEGORIES } from '../constants/categories';

const BudgetAlertBanner = ({ exceededBudgets }) => {
    if (!exceededBudgets || exceededBudgets.length === 0) return null;

    return (
        <div className="budget-alerts-banner">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <div>
                <strong>Warning:</strong> You have exceeded your budget in {exceededBudgets.length} categor{exceededBudgets.length === 1 ? 'y' : 'ies'}:{' '}
                {exceededBudgets.map(b => BUDGET_CATEGORIES.find(c => c.value === b.category)?.label || b.category).join(', ')}.
            </div>
        </div>
    );
};

export default BudgetAlertBanner;