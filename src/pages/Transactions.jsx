import React, { useState, useEffect, useRef } from 'react';
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

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const [groupedTransactions, setGroupedTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchedRef = useRef(false);

    // 1. Fetch Accounts / Products
    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts();
                setProducts(data);
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

    const accountId = selectedAccount?.productId;
    const bankId = selectedAccount?.bankDetails?.clientRegistrationId;

    // 2. Fetch Grouped Transactions
    useEffect(() => {
        if (!accountId || !bankId) return;

        let isActive = true;

        const loadTransactions = async () => {
            setIsLoading(true);
            try {
                const data = await fetchTransactions(accountId, bankId, fromDate, toDate);

                if (isActive) {
                    setGroupedTransactions(data || []);
                    setIsLoading(false);
                }
            } catch (error) {
                if (isActive) {
                    console.error('Failed to fetch transactions:', error);
                    setGroupedTransactions([]);
                    setIsLoading(false);
                }
            }
        };

        const timeoutId = setTimeout(() => {
            loadTransactions();
        }, 300);

        return () => {
            isActive = false;
            clearTimeout(timeoutId);
        };
    }, [accountId, bankId, fromDate, toDate]);

    const handleAccountChange = (acc) => {
        setSelectedAccount(acc);
        setIsDropdownOpen(false);
        setFromDate('');
        setToDate('');
    };

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

    const formatAmount = (amountObj) => {
        if (!amountObj) return '0.00 CZK';
        const sign = amountObj.value > 0 ? '+' : '';
        return `${sign}${amountObj.value} ${amountObj.currency}`;
    };

    const formatYAxis = (val) => {
        if (val === 0) return '0';
        if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
        return val.toFixed(0);
    };

    // --- UPDATED LOGIC FOR NEW BACKEND SCHEMA ---
    const extractChartAndSummaryData = () => {
        let globalIncome = 0;
        let globalExpenses = 0;
        const globalCategories = {};

        const chartData = [];
        let dataMax = 0;

        groupedTransactions.forEach(month => {
            let monthIncome = 0;
            let monthExpense = 0;

            month.groupedByCategory?.forEach(category => {
                // Read from the new separated objects.
                // Math.abs ensures Income is strictly positive and Expense is strictly negative,
                // regardless of whether your backend sends expenses as positive or negative numbers.
                const incVal = Math.abs(category.totalIncome?.value || 0);
                const expVal = -Math.abs(category.totalExpense?.value || 0);

                // Tally for the specific month's Chart columns
                monthIncome += incVal;
                monthExpense += Math.abs(expVal); // chart columns need positive heights

                // Tally for the Global Summary in the right sidebar
                globalIncome += incVal;
                globalExpenses += expVal;

                // Calculate Net Value for the category list
                const netVal = incVal + expVal;
                const currency = category.totalIncome?.currency || category.totalExpense?.currency || 'CZK';

                if (!globalCategories[category.groupName]) {
                    globalCategories[category.groupName] = { value: 0, currency: currency };
                }
                globalCategories[category.groupName].value += netVal;
            });

            if (monthIncome > dataMax) dataMax = monthIncome;
            if (monthExpense > dataMax) dataMax = monthExpense;

            chartData.push({
                label: month.groupName.substring(0, 3),
                income: monthIncome,
                expense: monthExpense
            });
        });

        let chartMax = 1000;
        if (dataMax > 0) {
            const magnitude = Math.pow(10, Math.floor(Math.log10(dataMax)));
            chartMax = Math.ceil(dataMax / magnitude) * magnitude;
        }

        return {
            income: globalIncome,
            expenses: globalExpenses,
            categories: Object.entries(globalCategories).map(([name, amount]) => ({ name, amount })),
            chartData,
            chartMax
        };
    };

    const summary = extractChartAndSummaryData();

    const chartLines = [
        summary.chartMax,
        summary.chartMax * (2/3),
        summary.chartMax * (1/3),
        0
    ];

    return (
        <div className="transactions-container">
            <div className="tx-grid">

                {/* ================= LEFT COLUMN ================= */}
                <div className="tx-left-col">
                    <div className="tx-account-selector">
                        <div
                            className={`tx-selector-box ${isDropdownOpen ? 'active' : ''}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="tx-selector-info">
                                <img
                                    src={`/bank-logos/${selectedAccount.bankDetails.clientRegistrationId}.png`}
                                    alt={`${selectedAccount.bankDetails.bankName || 'Bank'} Logo`}
                                    className="tx-bank-logo"
                                />
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
                                        onClick={() => handleAccountChange(acc)}
                                    >
                                        <img
                                            src={`/bank-logos/${acc.bankDetails.clientRegistrationId}.png`}
                                            alt={`${acc.bankDetails.bankName || 'Bank'} Logo`}
                                            className="tx-dr-bank-logo"
                                        />
                                        <div className="tx-acc-details">
                                            <h4>{acc.accountName}</h4>
                                            <p>{acc.productIdentification.iban}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="tx-controls-row">
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

                        <div className="tx-date-filters">
                            <div className="tx-date-input">
                                <label>From</label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>
                            <div className="tx-date-input">
                                <label>To</label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="tx-list">
                        {isLoading ? (
                            <div className="tx-message">Loading transactions...</div>
                        ) : groupedTransactions.length === 0 ? (
                            <div className="tx-message">No transactions found for the selected period.</div>
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
                    <div className="tx-card">
                        <div className="tx-card-header">
                            <h3>Cash flow</h3>
                            <div className="tx-legend">
                                <span><span className="tx-dot income"></span> Income</span>
                                <span><span className="tx-dot expense"></span> Outcome</span>
                            </div>
                        </div>

                        <div className="tx-chart-visual">

                            <div className="tx-chart-lines">
                                {chartLines.map((lineVal, idx) => (
                                    <React.Fragment key={idx}>
                                        <span>{formatYAxis(lineVal)}</span>
                                        <div className="tx-line"></div>
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="tx-chart-columns">
                                {summary.chartData.length === 0 ? (
                                    <div style={{ alignSelf: 'center', color: '#a0aec0', fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>
                                        No data to display
                                    </div>
                                ) : (
                                    summary.chartData.map((data, idx) => {
                                        const incHeight = (data.income / summary.chartMax) * 100;
                                        const expHeight = (data.expense / summary.chartMax) * 100;

                                        return (
                                            <div key={idx} className="tx-col">
                                                <div className="tx-bars">
                                                    <div
                                                        className="tx-bar inc"
                                                        style={{ height: `${incHeight}%` }}
                                                        title={`Income: ${data.income.toFixed(2)}`}
                                                    ></div>
                                                    <div
                                                        className="tx-bar exp"
                                                        style={{ height: `${expHeight}%` }}
                                                        title={`Expense: ${data.expense.toFixed(2)}`}
                                                    ></div>
                                                </div>
                                                <span>{data.label}</span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="tx-summary-totals">
                        <div className="tx-total-val income">
                            <span className="tx-arrow">^</span> Income: {summary.income > 0 ? '+' : ''}{summary.income.toFixed(2)} CZK
                        </div>
                        <div className="tx-total-val expense">
                            <span className="tx-arrow">v</span> Expenses: {summary.expenses.toFixed(2)} CZK
                        </div>
                    </div>

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