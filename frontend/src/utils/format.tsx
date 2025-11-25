import styles from "../components/specific/Analysis/AnalyzedKeywordRow/AnalyzedKeywordRow.module.css";
import React from "react";

export const renderStat = (
    value: string | number | undefined | null,
    isLoading: boolean,
    formatter: (val: any) => React.ReactNode = (v) => v
) => {
    if (isLoading) return <div className={styles.skeleton}/>;
    if (value == null) return <span className={styles.placeholder}>-</span>;
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
    const isZero = percentage === 0;

    return (
        <span className={isZero ? '' : (isPositive ? styles.positive : styles.negative)}>
            {isPositive ? '+' : ''}{percentage.toFixed(1)}%
    </span>
    );
};

// ▼▼▼ NEW FORMATTER ▼▼▼
export const formatCompetition = (val: string) => {
    if (val === 'UNSPECIFIED' || val === 'UNKNOWN') return '-';
    return val;
};