import React from 'react';
import AccountItem from './AccountItem';

const AccountGroup = ({group, isExpanded, onToggle, formatAmount}) => {
    const items = group?.products || group?.items || [];

    return (
        <div className="dashboard-group">
            <div className="dashboard-group-header" onClick={onToggle}>
                <div className="dashboard-group-title">
                    <h4>{group.groupName}</h4>
                    <span className={`dashboard-group-chevron ${isExpanded ? 'expanded' : ''}`}>▶</span>
                </div>
                <div className="dashboard-group-total">
                    {formatAmount(group.totalAmount)}
                </div>
            </div>

            {isExpanded && (
                <div className="dashboard-group-content">
                    {items.map(product => (
                        <AccountItem
                            key={product.productId}
                            product={product}
                            groupName={group.groupName}
                            formattedBalance={formatAmount(product.balance)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AccountGroup;