import React, {useState, useEffect, useRef} from 'react';
import { fetchProducts } from "../services/productService";
import { fetchTransactions } from "../services/transactionService";
import '../styles/Transactions.css';

const Transactions = () => {
    const [accounts, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedAccount, setSelectedAccount] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('All');

    const [groupedTransactions, setGroupedTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 2. Create the ref to track if we already fetched
    const fetchedRef = useRef(false);

    // 1. Fetch Accounts / Products
    useEffect(() => {
        // 3. Block the strict-mode double call
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts();
                setProducts(data);
                // Automatically select the first account if available
                if (data && data.length > 0) {
                    setSelectedAccount(data[0]);
                }
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

    // 2. Fetch Grouped Transactions using your new service function
    useEffect(() => {
        if (!selectedAccount) return;

        const loadTransactions = async () => {
            setIsLoading(true);
            try {
                // Ensure we pass both variables required by your new function
                const accountId = selectedAccount.productId;
                const clientRegistrationId = selectedAccount.bankDetails.clientRegistrationId;

                const data = await fetchTransactions(accountId, clientRegistrationId);
                setGroupedTransactions(data || []);
            } catch (error) {
                console.error('Failed to fetch transactions:', error);
                setGroupedTransactions([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadTransactions();
    }, [selectedAccount]);

    if (loading) {
        return (
            <div className="transactions-container" style={{ padding: '40px', textAlign: 'center' }}>
                <div className="loading-message text-gray-500">Loading your accounts...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="transactions-container" style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    // Helper to format amount exactly as backend provides it
    const formatAmount = (amountObj) => {
        if (!amountObj) return '0.00 CZK';
        const sign = amountObj.value > 0 ? '+' : '';
        return `${sign}${amountObj.value} ${amountObj.currency}`;
    };

    // Calculate simple totals directly from the array returned by your service
    const calculateSummary = () => {
        let income = 0;
        let expenses = 0;
        const categories = {};

        groupedTransactions.forEach(month => {
            month.groupedByCategory?.forEach(cat => {
                const val = cat.totalAmount?.value || 0;
                if (val > 0) income += val;
                else expenses += val;

                if (!categories[cat.groupName]) {
                    categories[cat.groupName] = { ...cat.totalAmount, value: 0 };
                }
                categories[cat.groupName].value += val;
            });
        });

        return {
            income,
            expenses,
            categories: Object.entries(categories).map(([name, amount]) => ({ name, amount }))
        };
    };

    const summary = calculateSummary();

    return (
        <div className="transactions-container">
            <div className="tx-grid">

                {/* ================= LEFT COLUMN ================= */}
                <div className="tx-left-col">

                    {/* Account Dropdown */}
                    <div className="tx-account-selector">
                        <div
                            className={`tx-selector-box ${isDropdownOpen ? 'active' : ''}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="tx-selector-info">
                                <div className="tx-acc-icon">
                                    {selectedAccount.bankDetails.bankName?.charAt(0) || '🏦'}
                                </div>
                                <div className="tx-acc-details">
                                    <h4>{selectedAccount.accountName}</h4>
                                    <p>{selectedAccount.productIdentification.iban}</p>
                                </div>
                            </div>
                            <span className="tx-caret">▼</span>
                        </div>

                        {isDropdownOpen && (
                            <div className="tx-dropdown-list">
                                {accounts.map((acc, idx) => (
                                    <div
                                        key={idx}
                                        className="tx-dropdown-item"
                                        onClick={() => {
                                            setSelectedAccount(acc);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <div className="tx-acc-icon sm">{acc.bankDetails.bankName?.charAt(0) || '🏦'}</div>
                                        <div className="tx-acc-details">
                                            <h4>{acc.accountName}</h4>
                                            <p>{acc.productIdentification.iban}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="tx-tabs">
                        {['All', 'Expenses', 'Income'].map(tab => (
                            <button
                                key={tab}
                                className={`tx-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Transaction List */}
                    <div className="tx-list">
                        {isLoading ? (
                            <div className="tx-message">Loading transactions...</div>
                        ) : groupedTransactions.length === 0 ? (
                            <div className="tx-message">No transactions found.</div>
                        ) : (
                            groupedTransactions.map((month, mIdx) => (
                                <div key={mIdx} className="tx-month-group">
                                    <h5 className="tx-month-title">{month.groupName}</h5>

                                    {month.groupedByCategory?.map(category =>
                                        category.transactions?.filter(tx => {
                                            if (activeTab === 'All') return true;
                                            if (activeTab === 'Expenses') return tx.direction === 'OUTCOME';
                                            if (activeTab === 'Income') return tx.direction === 'INCOME';
                                            return true;
                                        }).map((tx, tIdx) => (
                                            <div key={`${mIdx}-${tIdx}`} className="tx-item">
                                                <div className="tx-item-left">
                                                    <div className="tx-icon">
                                                        {category.groupName === 'Groceries' ? '🛒' : category.groupName.includes('Restaurant') ? '☕' : '💳'}
                                                    </div>
                                                    <div className="tx-info">
                                                        <span className="tx-merchant">{tx.counterpartyName || 'Unknown'}</span>
                                                        <span className="tx-meta">{category.groupName} <span className="tx-date">{tx.bookingDate ? `• ${tx.bookingDate}` : ''}</span></span>
                                                    </div>
                                                </div>
                                                <div className={`tx-amount ${tx.amount?.value < 0 ? 'expense' : 'income'}`}>
                                                    {formatAmount(tx.amount)}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* ================= RIGHT COLUMN ================= */}
                <div className="tx-right-col">

                    {/* Chart Area */}
                    <div className="tx-card">
                        <div className="tx-card-header">
                            <h3>Cash flow</h3>
                            <div className="tx-legend">
                                <span><span className="tx-dot income"></span> Income</span>
                                <span><span className="tx-dot expense"></span> Outcome</span>
                            </div>
                        </div>

                        {/* Pure CSS Visual Chart */}
                        <div className="tx-chart-visual">
                            <div className="tx-chart-lines">
                                <span>50K</span><div className="tx-line"></div>
                                <span>10K</span><div className="tx-line"></div>
                                <span>2K</span><div className="tx-line"></div>
                                <span>0</span><div className="tx-line"></div>
                            </div>
                            <div className="tx-chart-columns">
                                <div className="tx-col"><div className="tx-bars"><div className="tx-bar inc" style={{height: '40%'}}></div><div className="tx-bar exp" style={{height: '25%'}}></div></div><span>Aug</span></div>
                                <div className="tx-col"><div className="tx-bars"><div className="tx-bar inc" style={{height: '30%'}}></div><div className="tx-bar exp" style={{height: '35%'}}></div></div><span>Sept</span></div>
                                <div className="tx-col"><div className="tx-bars"><div className="tx-bar inc" style={{height: '80%'}}></div><div className="tx-bar exp" style={{height: '50%'}}></div></div><span>Oct</span></div>
                                <div className="tx-col"><div className="tx-bars"><div className="tx-bar inc" style={{height: '60%'}}></div><div className="tx-bar exp" style={{height: '40%'}}></div></div><span>Nov</span></div>
                                <div className="tx-col active"><div className="tx-bars"><div className="tx-bar inc" style={{height: '55%'}}></div><div className="tx-bar exp" style={{height: '65%'}}></div></div><span>Dec</span></div>
                                <div className="tx-col"><div className="tx-bars"><div className="tx-bar inc" style={{height: '15%'}}></div><div className="tx-bar exp" style={{height: '8%'}}></div></div><span>Jan</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Totals */}
                    <div className="tx-summary-totals">
                        <div className="tx-total-val income">
                            <span className="tx-arrow">^</span> Income: {summary.income > 0 ? '+' : ''}{summary.income.toFixed(2)} CZK
                        </div>
                        <div className="tx-total-val expense">
                            <span className="tx-arrow">v</span> Expenses: {summary.expenses.toFixed(2)} CZK
                        </div>
                    </div>

                    {/* Category Breakdown */}
                    <div className="tx-categories-card">
                        {!isLoading && summary.categories.map((cat, idx) => (
                            <div key={idx} className="tx-cat-item">
                                <div className="tx-cat-left">
                                    <span className="tx-cat-icon">
                                        {cat.name === 'Groceries' ? '🛒' : cat.name.includes('Health') || cat.name.includes('Medical') ? '♡' : cat.name.includes('Transport') ? '🚆' : '💳'}
                                    </span>
                                    <span className="tx-cat-name">{cat.name}</span>
                                </div>
                                <div className={`tx-cat-amount ${cat.amount.value < 0 ? 'expense' : 'income'}`}>
                                    {formatAmount(cat.amount)}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Transactions;