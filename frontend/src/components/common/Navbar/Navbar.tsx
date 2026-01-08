import React from 'react';
import { HiOutlineMoon, HiOutlineBell } from 'react-icons/hi'; // Import Bell
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {/* Left Side: Logo and Product Title */}
                <div className={styles.logoContainer}>
                    <img
                        src="/images/base-logo.svg"
                        alt="Ads by Joris"
                        className={styles.logoImage}
                    />
                    <div className={styles.separator}></div>
                    <h1 className={styles.productTitle}>
                        MyNextCampaign
                    </h1>
                </div>

                {/* Right Side: Actions */}
                <div className={styles.actions}>
                    <button className={styles.iconButton} title="Toggle Theme (Coming Soon)">
                        <HiOutlineMoon size={22} />
                    </button>
                    {/* ▼▼▼ Replaced Cog with Bell ▼▼▼ */}
                    <button className={styles.iconButton} title="Notifications (Coming Soon)">
                        <HiOutlineBell size={22} />
                    </button>
                    {/* ▲▲▲ Replaced Cog with Bell ▲▲▲ */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;