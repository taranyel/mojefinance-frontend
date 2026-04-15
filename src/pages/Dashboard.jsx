import React, {useState, useEffect, useRef, useCallback} from 'react';
import {fetchAssetsAndLiabilities, fetchCashFlow} from '../services/productService';
import {useFormatAmount, useCashFlowAnalytics} from '../hooks';

import FinanceCard from '../components/FinanceCard';
import {CashFlowChart} from '../components/CashFlowChart';
import {SummaryTotals} from '../components/SummaryTotals';
import {CategoriesCard} from '../components/CategoriesCard';

import '../styles/Dashboard.css';
import '../styles/Transactions.css';

const Dashboard = () => {
    const [finances, setFinances] = useState({
        assets: {products: [], totalAmount: null},
        liabilities: {products: [], totalAmount: null}
    });
    const [groupedTransactions, setGroupedTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collapsedAssets, setCollapsedAssets] = useState({});
    const [collapsedLiabilities, setCollapsedLiabilities] = useState({});

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

        const loadDashboard = async () => {
            try {
                setLoading(true);
                const [finData, flowData] = await Promise.all([
                    fetchAssetsAndLiabilities(),
                    fetchCashFlow()
                ]);

                setFinances({
                    assets: finData?.assets || {products: [], totalAmount: null},
                    liabilities: finData?.liabilities || {products: [], totalAmount: null}
                });

                setGroupedTransactions(Array.isArray(flowData) ? flowData : (flowData?.groupedTransactions || []));
            } catch (err) {
                setError("Could not load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, []);

    const toggleAssetGroup = useCallback((idx) => setCollapsedAssets(p => ({...p, [idx]: !p[idx]})), []);
    const toggleLiabGroup = useCallback((idx) => setCollapsedLiabilities(p => ({...p, [idx]: !p[idx]})), []);
    const getGroups = (source) => source?.products || source?.groupedProducts || [];

    if (loading) return <div className="dashboard-grid loading">Loading Dashboard...</div>;
    if (error) return <div className="dashboard-grid error">{error}</div>;

    return (
        <div className="dashboard-grid">
            <div className="dashboard-analytics-row">
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

                <div className="dashboard-summary-side">
                    <SummaryTotals activeMonthData={activeMonthData}/>
                    <CategoriesCard categories={activeMonthData.categories} formatAmount={formatAmount}/>
                </div>
            </div>

            <div className="dashboard-row">
                <FinanceCard
                    title="Total Assets"
                    className="assets-card"
                    totalAmount={finances.assets?.totalAmount || {value: 0, currency: 'CZK'}}
                    groups={getGroups(finances.assets)}
                    collapsedState={collapsedAssets}
                    onToggleGroup={toggleAssetGroup}
                    formatAmount={formatAmount}
                />

                <FinanceCard
                    title="Total Liabilities"
                    className="liabilities-card"
                    totalAmount={finances.liabilities?.totalAmount || {value: 0, currency: 'CZK'}}
                    groups={getGroups(finances.liabilities)}
                    collapsedState={collapsedLiabilities}
                    onToggleGroup={toggleLiabGroup}
                    formatAmount={formatAmount}
                />
            </div>
        </div>
    );
};

export default Dashboard;