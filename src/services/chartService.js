/**
 * Pure logic to transform grouped transactions into chart-ready data
 */
export const extractChartData = (groupedTransactions) => {
    const parseGroupName = (name) => {
        if (!name) return null;
        const cleanName = name.replace(/sept/i, 'Sep');
        const d = new Date(cleanName);
        return !isNaN(d.getTime()) ? { month: d.getMonth(), year: d.getFullYear(), time: d.getTime() } : null;
    };

    let startMonth = new Date().getMonth();
    let startYear = new Date().getFullYear();

    if (groupedTransactions?.length > 0) {
        let earliestTime = Infinity;
        let foundValid = false;

        groupedTransactions.forEach(group => {
            const parsed = parseGroupName(group.groupName);
            if (parsed && parsed.time < earliestTime) {
                earliestTime = parsed.time;
                startMonth = parsed.month;
                startYear = parsed.year;
                foundValid = true;
            }
        });

        if (!foundValid) {
            startMonth -= 5;
            if (startMonth < 0) { startMonth += 12; startYear -= 1; }
        }
    } else {
        startMonth -= 5;
        if (startMonth < 0) { startMonth += 12; startYear -= 1; }
    }

    const targetMonths = [];
    const monthAggregates = {};

    for (let i = 0; i < 6; i++) {
        const d = new Date(startYear, startMonth + i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const label = d.toLocaleString('en-US', { month: 'short' });

        targetMonths.push({ key, label });
        monthAggregates[key] = { key, label, income: 0, expense: 0, categories: {} };
    }

    groupedTransactions?.forEach(month => {
        const parsed = parseGroupName(month.groupName);
        if (!parsed) return;
        const matchKey = `${parsed.year}-${parsed.month}`;

        if (monthAggregates[matchKey]) {
            monthAggregates[matchKey].income += Math.abs(month.totalIncome?.value || 0);
            monthAggregates[matchKey].expense += Math.abs(month.totalExpense?.value || 0);

            month.groupedTransactions?.forEach(category => {
                const catName = category.groupName || 'Other';
                if (!monthAggregates[matchKey].categories[catName]) {
                    monthAggregates[matchKey].categories[catName] = {
                        name: catName,
                        value: 0,
                        currency: category.totalIncome?.currency || category.totalExpense?.currency || 'CZK'
                    };
                }
                monthAggregates[matchKey].categories[catName].value += ((category.totalIncome?.value || 0) + (category.totalExpense?.value || 0));
            });
        }
    });

    let dataMax = 0;
    const chartData = targetMonths.map(m => {
        const data = monthAggregates[m.key];
        dataMax = Math.max(dataMax, data.income, data.expense);

        return {
            ...data,
            categories: Object.values(data.categories).map(c => ({
                name: c.name,
                amount: { value: c.value, currency: c.currency }
            }))
        };
    });

    const magnitude = dataMax > 0 ? Math.pow(10, Math.floor(Math.log10(dataMax))) : 1;
    const chartMax = dataMax > 0 ? Math.ceil(dataMax / magnitude) * magnitude : 1000;

    return { chartData, chartMax };
};

export const formatYAxis = (val) => {
    if (val === 0) return '0';
    return val >= 1000 ? (val / 1000).toFixed(0) + 'K' : val.toFixed(0);
};