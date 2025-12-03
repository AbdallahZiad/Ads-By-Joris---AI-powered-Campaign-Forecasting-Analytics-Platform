import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineCollection,
    HiOutlineChartBar,
    HiOutlineSearch,
    HiOutlineCog,
    HiOutlineUserCircle,
    HiLogout,
    HiUser,
    HiCheck
} from 'react-icons/hi';
import { AiOutlineGoogle } from 'react-icons/ai';
import styles from './Sidebar.module.css';
import { useAuth } from '../../../contexts/AuthContext';

type ViewMode = 'management' | 'analysis' | 'scanner' | 'google-ads';

interface NavLinkProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    indicator?: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active = false, disabled = false, onClick, indicator }) => {
    return (
        <button
            className={`${styles.navButton} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${active ? 'bg-gray-700 text-white' : ''}`}
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

            <span className={`${styles.iconWrapper} ${active ? styles.navButtonActiveText : ''} relative`}>
                {icon}
                {indicator && (
                    <div className="absolute -top-1 -right-1 z-10">
                        {indicator}
                    </div>
                )}
            </span>
        </button>
    );
};

interface SidebarProps {
    viewMode: ViewMode | 'none';
    onNavigate: (mode: ViewMode) => void;
    // Removed hasScannedData
    hasAnalysisData: boolean;
    onAuthClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ viewMode, onNavigate, hasAnalysisData, onAuthClick }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isAdsLinked = !!user?.is_google_ads_linked;

    const handleGoogleAdsClick = () => {
        if (!isAuthenticated) {
            onAuthClick();
            return;
        }
        onNavigate('google-ads');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

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
                    disabled={false} // Always open
                    onClick={() => onNavigate('management')}
                />
                <NavLink
                    icon={<HiOutlineChartBar size={22} />}
                    label="Analysis Dashboard"
                    active={viewMode === 'analysis'}
                    disabled={!hasAnalysisData}
                    onClick={() => onNavigate('analysis')}
                />

                <NavLink
                    icon={<AiOutlineGoogle size={22} />}
                    label={isAdsLinked ? "Google Ads Linked" : "Link Google Ads"}
                    active={viewMode === 'google-ads'}
                    disabled={false}
                    onClick={handleGoogleAdsClick}
                    indicator={isAdsLinked ? (
                        <div className="flex items-center justify-center w-2.5 h-2.5 bg-green-500 rounded-full border border-white shadow-sm">
                            <HiCheck className="text-white" size={6} strokeWidth={4} />
                        </div>
                    ) : null}
                />
            </div>

            <div className={styles.navSection}>
                <NavLink
                    icon={<HiOutlineCog size={22} />}
                    label="Settings"
                />

                {isAuthenticated ? (
                    <div className="relative" ref={menuRef}>
                        <button
                            className={`${styles.profileButton} ${isMenuOpen ? 'ring-2 ring-teal-500' : ''}`}
                            title={user?.full_name || user?.email}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {user?.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt="Profile"
                                    className={`${styles.profileImage} object-cover`}
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
                                    {(user?.full_name?.[0] || user?.email[0] || 'U').toUpperCase()}
                                </div>
                            )}
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="absolute left-12 bottom-0 ml-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 origin-bottom-left"
                                >
                                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {user?.full_name || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            onClick={() => alert("Profile Settings coming soon")}
                                        >
                                            <HiUser size={16} /> Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <HiLogout size={16} /> Logout
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <button
                        className={`${styles.profileButton} animate-pulse`}
                        title="Sign In"
                        onClick={onAuthClick}
                    >
                        <HiOutlineUserCircle size={24} />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;