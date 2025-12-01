import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineCollection,
    HiOutlineChartBar,
    HiOutlineSearch,
    HiOutlineCog,
    HiOutlineUserCircle,
    HiLogout,
    HiUser
} from 'react-icons/hi';
import { AiOutlineGoogle } from 'react-icons/ai';
import styles from './Sidebar.module.css';
import { useAuth } from '../../../contexts/AuthContext';

type ViewMode = 'management' | 'analysis' | 'scanner';

interface NavLinkProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    disabled?: boolean;
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
    hasScannedData: boolean;
    hasAnalysisData: boolean;
    onAuthClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ viewMode, onNavigate, hasScannedData, hasAnalysisData, onAuthClick }) => {
    const { user, isAuthenticated, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
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
                    disabled={!hasScannedData}
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
                    label="Google Campaigns"
                    active={false}
                    disabled={true}
                />
            </div>

            <div className={styles.navSection}>
                <NavLink
                    icon={<HiOutlineCog size={22} />}
                    label="Settings"
                />

                {isAuthenticated ? (
                    // Logged In State with Clickable Menu
                    <div className="relative" ref={menuRef}>
                        <button
                            className={`${styles.profileButton} ${isMenuOpen ? 'ring-2 ring-teal-500' : ''}`}
                            title={user?.full_name || user?.email}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {/* ▼▼▼ AVATAR LOGIC ▼▼▼ */}
                            {user?.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt="Profile"
                                    className={`${styles.profileImage} object-cover`} // Ensure fit
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
                    // Guest State
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