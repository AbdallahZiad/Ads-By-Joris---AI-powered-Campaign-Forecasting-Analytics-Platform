import React, { useState, ReactNode } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import EditableLabel from '../EditableLabel/EditableLabel';
import styles from './Collapsible.module.css';

export interface CollapsibleProps {
    title: string;
    initialOpen?: boolean;
    onTitleSave?: (newName: string) => void;
    headerActions?: ReactNode;
    children: ReactNode;
    containerClassName?: string;
    headerClassName?: string;
    contentClassName?: string;
    titleClassName?: string;
    // ▼▼▼ NEW PROPS ▼▼▼
    selectable?: boolean;
    selected?: boolean;
    onSelect?: (isSelected: boolean) => void;
}

const Collapsible: React.FC<CollapsibleProps> = ({
                                                     title,
                                                     initialOpen = false,
                                                     onTitleSave,
                                                     headerActions,
                                                     children,
                                                     containerClassName = '',
                                                     headerClassName = '',
                                                     contentClassName = '',
                                                     titleClassName = 'text-lg font-semibold text-gray-800',
                                                     selectable = false,
                                                     selected = false,
                                                     onSelect,
                                                 }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const toggleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onSelect?.(e.target.checked);
    };

    // Stop propagation on the container to prevent header clicks from toggling it
    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className={`${styles.container} ${containerClassName}`}>
            <div
                className={`${styles.header} ${headerClassName} header-hover-target`}
                onClick={toggleOpen}
                style={{ cursor: 'pointer' }}
            >
                <button
                    className={styles.toggleButton}
                    onClick={toggleOpen}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? "Collapse" : "Expand"}
                >
                    <HiChevronDown
                        className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
                        size={24}
                    />
                </button>

                <div className={styles.labelWrapper} onClick={(e) => e.stopPropagation()}>
                    <EditableLabel
                        initialValue={title}
                        onSave={onTitleSave || (() => {})}
                        isEditable={!!onTitleSave}
                        className={titleClassName}
                    />
                </div>

                <div className={styles.spacer} />

                {headerActions && (
                    <div className={styles.headerActions} onClick={(e) => e.stopPropagation()}>
                        {headerActions}
                    </div>
                )}

                {/* ▼▼▼ NEW: Always visible checkbox ▼▼▼ */}
                {selectable && (
                    <div className={styles.checkboxContainer} onClick={handleCheckboxClick}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            checked={selected}
                            onChange={handleCheckboxChange}
                            aria-label={`Select ${title}`}
                        />
                    </div>
                )}
                {/* ▲▲▲ NEW ▲▲▲ */}
            </div>

            <div className={`${styles.contentContainer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.innerContent}>
                    <div className={contentClassName}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Collapsible;