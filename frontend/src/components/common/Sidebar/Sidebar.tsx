import React from 'react';
import { motion } from 'framer-motion';
import {
    HiOutlineCollection,
    HiOutlineChartBar,
    HiOutlineSearch,
    HiOutlineCog,
    HiOutlineUserCircle
} from 'react-icons/hi';
import { AiOutlineGoogle } from 'react-icons/ai';
import styles from './Sidebar.module.css';

type ViewMode = 'management' | 'analysis' | 'scanner';

interface NavLinkProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    disabled?: boolean; // ▼▼▼ NEW PROP ▼▼▼
    onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active = false, disabled = false, onClick }) => {
    return (
        <button
            className={`${styles.navButton} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={label}
            aria-label={label}
            onClick={!disabled ? onClick : undefined}
            disabled={disabled}
        >
            {active && !disabled && (
                <motion.div
                    layoutId="activeSidebarTab"
                    className={styles.activeIndicator}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}

            <span className={`${styles.iconWrapper} ${active ? styles.navButtonActiveText : ''}`}>
        {icon}
      </span>
        </button>
    );
};

interface SidebarProps {
    viewMode: ViewMode;
    onNavigate: (mode: ViewMode) => void;
    hasScannedData: boolean; // ▼▼▼ NEW PROP ▼▼▼
    hasAnalysisData: boolean; // ▼▼▼ NEW PROP ▼▼▼
}

const Sidebar: React.FC<SidebarProps> = ({ viewMode, onNavigate, hasScannedData, hasAnalysisData }) => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.navSection}>
                <NavLink
                    icon={<HiOutlineSearch size={22} />}
                    label="Website Scanner"
                    active={viewMode === 'scanner'}
                    onClick={() => onNavigate('scanner')}
                />
                <NavLink
                    icon={<HiOutlineCollection size={22} />}
                    label="Category Planner"
                    active={viewMode === 'management'}
                    disabled={!hasScannedData} // Disable if no data
                    onClick={() => onNavigate('management')}
                />
                <NavLink
                    icon={<HiOutlineChartBar size={22} />}
                    label="Analysis Dashboard"
                    active={viewMode === 'analysis'}
                    disabled={!hasAnalysisData} // Disable if no analysis
                    onClick={() => onNavigate('analysis')}
                />
                <NavLink
                    icon={<AiOutlineGoogle size={22} />}
                    label="Google Campaigns"
                    active={false}
                    disabled={true} // Future feature
                />
            </div>

            <div className={styles.navSection}>
                <NavLink
                    icon={<HiOutlineCog size={22} />}
                    label="Settings"
                />
                <button className={styles.profileButton} title="Profile">
                    <HiOutlineUserCircle size={22} />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;