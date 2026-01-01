import React from "react";
// ▼▼▼ FIX: Removed dependency on specific component CSS modules for robustness

export const renderStat = (
    value: string | number | undefined | null,
    isLoading: boolean,
    formatter: (val: any) => React.ReactNode = (v) => v
) => {
    // We use inline styles for the skeleton/placeholder to ensure they work everywhere
    if (isLoading) return (
        <div style={{
            height: '0.875rem',
            width: '70%',
            marginLeft: 'auto',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.25rem',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />
    );

    if (value == null) return <span style={{ color: '#d1d5db' }}>-</span>;

    return formatter(value);
};

export const formatNumber = (num: number) => new Intl.NumberFormat('en-US', {notation: 'compact'}).format(num);

export const formatCurrency = (micros: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
}).format(micros / 1_000_000);

export const formatMultiplier = (val: number) => {
    const percentage = val * 100;
    const isPositive = percentage > 0;
    // Check strict zero or very small float near zero
    const isZero = percentage === 0 || Math.abs(percentage) < 0.01;

    // ▼▼▼ FIX: Use explicit colors to override parent container styles (e.g. Indigo headers) ▼▼▼
    let color = '#ef4444'; // Red-500 (Negative)
    if (isZero) color = '#374151'; // Gray-700 (Neutral / Zero) - Matches Current Vol
    else if (isPositive) color = '#10b981'; // Green-500 (Positive)

    return (
        <span style={{ color, fontWeight: 500 }}>
            {isPositive ? '+' : ''}{percentage.toFixed(1)}%
        </span>
    );
};

export const formatCompetition = (val: string) => {
    if (val === 'UNSPECIFIED' || val === 'UNKNOWN') return '-';
    return val;
};