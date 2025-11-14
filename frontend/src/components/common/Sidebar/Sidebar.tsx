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

type ViewMode = 'management' | 'analysis';

interface NavLinkProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active = false }) => {
    return (
        <button
            className={styles.navButton}
            title={label}
            aria-label={label}
        >
            {/* This is the magic element. It only renders if 'active' is true.
              The 'layoutId' tells Framer Motion to animate it from its
              old position (in the previous active link) to its new one.
            */}
            {active && (
                <motion.div
                    layoutId="activeSidebarTab"
                    className={styles.activeIndicator}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
            )}

            {/* This wrapper ensures the icon always sits on top of the indicator */}
            <span className={`${styles.iconWrapper} ${active ? styles.navButtonActiveText : ''}`}>
                {icon}
            </span>
        </button>
    );
};

interface SidebarProps {
    viewMode: ViewMode;
}

const Sidebar: React.FC<SidebarProps> = ({ viewMode }) => {
    return (
        <aside className={styles.sidebar}>
            {/* Top Navigation Items */}
            <div className={styles.navSection}>
                <NavLink
                    icon={<HiOutlineSearch size={22} />}
                    label="Website Scanner"
                    active={false} // Not active for now
                />
                <NavLink
                    icon={<HiOutlineCollection size={22} />}
                    label="Category Planner"
                    active={viewMode === 'management'}
                />
                <NavLink
                    icon={<HiOutlineChartBar size={22} />}
                    label="Analysis Dashboard"
                    active={viewMode === 'analysis'}
                />
                <NavLink
                    icon={<AiOutlineGoogle size={22} />}
                    label="Google Campaigns"
                    active={false} // Not active for now
                />
            </div>

            {/* Bottom Profile/Settings */}
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