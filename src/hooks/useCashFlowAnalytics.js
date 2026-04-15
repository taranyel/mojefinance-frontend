import {useState, useEffect, useMemo, useCallback} from 'react';
import {extractChartData, formatYAxis} from '../services/chartService';

export const useCashFlowAnalytics = (groupedTransactions) => {
    const [activeMonthKey, setActiveMonthKey] = useState('');

    const summary = useMemo(() =>
            extractChartData(groupedTransactions),
        [groupedTransactions]);

    useEffect(() => {
        if (summary.chartData?.length > 0) {
            const exists = summary.chartData.find(d => d.key === activeMonthKey);
            if (!activeMonthKey || !exists) {
                setActiveMonthKey(summary.chartData[0].key);
            }
        }
    }, [summary, activeMonthKey]);

    const activeMonthData = useMemo(() => {
        return summary.chartData.find(d => d.key === activeMonthKey) ||
            {income: 0, expense: 0, categories: []};
    }, [summary, activeMonthKey]);

    const chartLines = useMemo(() => [
        summary.chartMax,
        summary.chartMax * (2 / 3),
        summary.chartMax * (1 / 3),
        0
    ], [summary.chartMax]);

    return {
        summary,
        activeMonthKey,
        setActiveMonthKey,
        activeMonthData,
        chartLines,
        formatYAxis: useCallback(formatYAxis, [])
    };
};