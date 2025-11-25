import React from 'react';
import styles from './ScanStatsPanel.module.css';
import { CrawlStats, LlmMetrics } from '../../../../types';

interface Props {
    crawlStats: CrawlStats;
    llmMetrics: LlmMetrics;
}

const ScanStatsPanel: React.FC<Props> = ({ crawlStats, llmMetrics }) => {
    return (
        <div className={styles.statsPanel}>
            <div className={styles.statItem}>
                <span className={styles.statLabel}>Pages Crawled</span>
                <span className={styles.statValue}>{crawlStats.pages_crawled}</span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.statLabel}>Links Found</span>
                <span className={styles.statValue}>{crawlStats.total_links_found}</span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.statLabel}>Duration</span>
                <span className={styles.statValue}>{crawlStats.crawl_duration_seconds}s</span>
            </div>
            <div className={styles.statItem}>
                <span className={styles.statLabel}>LLM Tokens</span>
                <span className={styles.statValue}>{llmMetrics.total_tokens}</span>
            </div>
        </div>
    );
};

export default ScanStatsPanel;