import React, {useState, useEffect, useRef, useCallback} from 'react';
import {fetchProducts} from '../services/productService';
import {fetchTransactions} from '../services/transactionService';
import {useFormatAmount, useCashFlowAnalytics} from '../hooks';

import AccountSelector from '../components/AccountSelector';
import TransactionControls from '../components/TransactionControls';
import TransactionList from '../components/TransactionList';
import {CashFlowChart} from '../components/CashFlowChart';
import {SummaryTotals} from '../components/SummaryTotals';
import {CategoriesCard} from '../components/CategoriesCard';

import '../styles/Transactions.css';

const Transactions = () => {
    const [accounts, setAccounts] = useState([]);
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
    const formatAmount = useFormatAmount();

    const {
        summary,
        activeMonthKey,
        setActiveMonthKey,
        activeMonthData,
        chartLines,
        formatYAxis
    } = useCashFlowAnalytics(groupedTransactions);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts();
                setAccounts(data);
                if (data?.length > 0) setSelectedAccount(data[0]);
            } catch (err) {
                setError('Could not load your accounts.');
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    useEffect(() => {
        const accountId = selectedAccount?.productId;
        const bankId = selectedAccount?.bankDetails?.clientRegistrationId;
        if (!accountId || !bankId) return;

        let isActive = true;
        const loadTransactions = async () => {
            setIsLoading(true);
            try {
                const data = await fetchTransactions(accountId, bankId, fromDate, toDate);
                if (isActive) {
                    setGroupedTransactions(Array.isArray(data) ? data : (data?.groupedTransactions || []));
                }
            } catch (err) {
                if (isActive) setGroupedTransactions([]);
            } finally {
                if (isActive) setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(loadTransactions, 300);
        return () => {
            isActive = false;
            clearTimeout(timeoutId);
        };
    }, [selectedAccount, fromDate, toDate]);

    const handleAccountChange = useCallback((acc) => {
        setSelectedAccount(acc);
        setIsDropdownOpen(false);
        setFromDate('');
        setToDate('');
        setActiveMonthKey('');
    }, [setActiveMonthKey]);

    const filterTransaction = useCallback((tx) => {
        if (activeTab === 'All') return true;
        return activeTab === 'Expenses' ? tx.direction === 'OUTCOME' : tx.direction === 'INCOME';
    }, [activeTab]);

    if (loading) return <div className="transactions-container loading">Loading...</div>;
    if (error) return <div className="transactions-container error">{error}</div>;

    return (
        <div className="transactions-container">
            <div className="tx-grid">
                <div className="tx-left-col">
                    <AccountSelector
                        selectedAccount={selectedAccount}
                        accounts={accounts}
                        isDropdownOpen={isDropdownOpen}
                        onDropdownToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                        onAccountChange={handleAccountChange}
                    />
                    <TransactionControls
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                    />
                    <TransactionList
                        groupedTransactions={groupedTransactions}
                        isLoading={isLoading}
                        filterTransaction={filterTransaction}
                        formatAmount={formatAmount}
                    />
                </div>

                <div className="tx-right-col">
                    <div className="tx-card">
                        <div className="tx-card-header">
                            <h3>Cash flow</h3>
                            <div className="tx-legend">
                                <span><span className="tx-dot income"></span>Income</span>
                                <span><span className="tx-dot expense"></span>Outcome</span>
                            </div>
                        </div>
                        <CashFlowChart
                            summary={summary}
                            chartLines={chartLines}
                            formatYAxis={formatYAxis}
                            activeMonthKey={activeMonthKey}
                            onMonthClick={setActiveMonthKey}
                        />
                    </div>
                    {!isLoading && (
                        <>
                            <SummaryTotals activeMonthData={activeMonthData}/>
                            <CategoriesCard categories={activeMonthData.categories} formatAmount={formatAmount}/>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transactions;