import React from 'react';
import { HiPlus } from 'react-icons/hi';
import styles from './AddItemButton.module.css';

interface AddItemButtonProps {
    label: string;
    onClick: () => void;
    className?: string;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({
                                                         label,
                                                         onClick,
                                                         className = '',
                                                     }) => {
    return (
        <button className={`${styles.button} ${className}`} onClick={onClick} aria-label={label}>
            <HiPlus className={styles.icon} size={16} />
            <span>{label}</span>
        </button>
    );
};

export default AddItemButton;