import React from 'react';
import { HiCheck } from 'react-icons/hi';
import styles from './ProportionalCheckbox.module.css';

interface Props {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

const ProportionalCheckbox: React.FC<Props> = ({
                                                   label,
                                                   checked,
                                                   onChange,
                                                   disabled = false,
                                                   className = ''
                                               }) => {
    return (
        <label className={`${styles.container} ${checked ? styles.checked : ''} ${disabled ? styles.disabled : ''} ${className}`}>
            <input
                type="checkbox"
                className={styles.hiddenCheckbox}
                checked={checked}
                onChange={(e) => !disabled && onChange(e.target.checked)}
                disabled={disabled}
            />
            <div className={styles.customCheckbox}>
                <HiCheck className="text-white" size={12} />
            </div>
            <span className={styles.label}>{label}</span>
        </label>
    );
};

export default ProportionalCheckbox;