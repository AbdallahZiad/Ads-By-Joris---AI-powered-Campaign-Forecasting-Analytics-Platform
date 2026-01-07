import React from "react";

export const renderStat = (
    value: string | number | undefined | null,
    isLoading: boolean,
    formatter: (val: any) => React.ReactNode = (v) => v
) => {
    // 1. Loading State (Explicit)
    if (isLoading) {
        return (
            <div style={{
                height: '0.875rem',
                width: '70%',
                marginLeft: 'auto',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.25rem',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }} />
        );
    }

    // 2. Unavailable State (Null or Undefined)
    // We use == null to catch both null and undefined
    if (value == null) {
        return <span style={{ color: '#d1d5db', fontWeight: 400 }}>-</span>;
    }

    // 3. Available Data (Includes 0)
    return formatter(value);
};

export const formatNumber = (num: number) => {
    const n = Number(num);
    if (isNaN(n)) return '-';
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n);
};

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

    // Colors
    let color = '#ef4444'; // Red (Negative)
    if (isZero) color = '#9ca3af'; // Gray-400 (Neutral / Zero) - Subtle
    else if (isPositive) color = '#10b981'; // Green (Positive)

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