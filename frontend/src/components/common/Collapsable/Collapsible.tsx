import React, { useState, ReactNode } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import styles from './Collapsible.module.css';

interface CollapsibleProps {
    title: string;
    children: ReactNode;
    initialOpen?: boolean;
    contentBgClass?: string;
}

const Collapsible: React.FC<CollapsibleProps> = ({
                                                     title,
                                                     children,
                                                     initialOpen = false,
                                                     contentBgClass = 'bg-white',
                                                 }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.collapsibleContainer}>
            <button
                className={styles.collapsibleHeader}
                onClick={toggleOpen}
                aria-expanded={isOpen}
            >
                <h3 className={styles.collapsibleTitle}>{title}</h3>
                <span className={`${styles.collapsibleIcon} ${isOpen ? styles.open : ''}`}>
          <HiChevronDown size={20} />
        </span>
            </button>
            <div
                className={`${styles.collapsibleContent} ${isOpen ? styles.open : ''}`}
            >
                <div className={styles.collapsibleInnerContent}>
                    <div className={`${styles.contentWrapper} ${contentBgClass}`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Collapsible;