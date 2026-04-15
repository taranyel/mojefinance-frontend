import React from 'react';

export const CashFlowChart = ({ summary, chartLines, formatYAxis, activeMonthKey, onMonthClick }) => {
    return (
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
                    <div className="tx-no-data">No data to display</div>
                ) : (
                    summary.chartData.map((data) => {
                        const incHeight = data.income > 0 ? (data.income / summary.chartMax) * 100 : 0;
                        const expHeight = data.expense > 0 ? (data.expense / summary.chartMax) * 100 : 0;

                        return (
                            <div
                                key={data.key}
                                className={`tx-col ${activeMonthKey === data.key ? 'active' : ''}`}
                                onClick={() => onMonthClick(data.key)}
                            >
                                <div className="tx-bars">
                                    {incHeight > 0 && (
                                        <div
                                            className="tx-bar inc"
                                            style={{ height: `${incHeight}%` }}
                                        ></div>
                                    )}
                                    {expHeight > 0 && (
                                        <div
                                            className="tx-bar exp"
                                            style={{ height: `${expHeight}%` }}
                                        ></div>
                                    )}
                                </div>
                                <span>{data.label}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};