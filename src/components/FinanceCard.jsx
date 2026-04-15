import React from 'react';
import AccountGroup from './AccountGroup';

const FinanceCard = ({ title, totalAmount, groups, collapsedState, onToggleGroup, formatAmount, className }) => {
    return (
        <div className={`card-widget ${className}`}>
            <h3>{title}</h3>
            <div className="amount-large">
                {formatAmount(totalAmount)}
            </div>

            <div className="account-list-scrollable" style={{ marginTop: '16px' }}>
                {groups.map((group, gIdx) => (
                    <AccountGroup
                        key={`${title}-group-${gIdx}`}
                        group={group}
                        isExpanded={!collapsedState[gIdx]}
                        onToggle={() => onToggleGroup(gIdx)}
                        formatAmount={formatAmount}
                    />
                ))}

                {groups.length === 0 && (
                    <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                        No {title.toLowerCase().replace('total ', '')} found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default FinanceCard;