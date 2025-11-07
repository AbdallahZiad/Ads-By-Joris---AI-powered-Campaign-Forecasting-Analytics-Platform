import React, { useState, useEffect, useRef } from 'react';
import { HiOutlinePencil, HiOutlineCheck } from 'react-icons/hi';
import styles from './EditableLabel.module.css';

interface EditableLabelProps {
    initialValue: string;
    onSave: (newValue: string) => void;
    isEditable?: boolean;
    className?: string; // For standard text styling (font size, weight, color)
    inputClassName?: string; // For specific input styling overrides if needed
}

const EditableLabel: React.FC<EditableLabelProps> = ({
                                                         initialValue,
                                                         onSave,
                                                         isEditable = true,
                                                         className = '',
                                                         inputClassName = '',
                                                     }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sync with external changes
    useEffect(() => {
        setCurrentValue(initialValue);
    }, [initialValue]);

    // Auto-focus and select on edit
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleStartEdit = (e?: React.MouseEvent) => {
        if (!isEditable) return;
        e?.stopPropagation(); // Prevent triggering parent onClick (like collapsible toggle)
        setIsEditing(true);
    };

    const handleSave = (e?: React.MouseEvent | React.FocusEvent) => {
        e?.stopPropagation();
        const trimmed = currentValue.trim();
        if (trimmed && trimmed !== initialValue) {
            onSave(trimmed);
        } else {
            setCurrentValue(initialValue); // Revert
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setCurrentValue(initialValue); // Revert
        }
    };

    if (isEditing) {
        return (
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <input
                    ref={inputRef}
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`${styles.input} ${className} ${inputClassName}`}
                    // Simple dynamic width approximation
                    // size={Math.max(currentValue.length /2, 1)}
                    onClick={(e) => e.stopPropagation()}
                />
                <button className={styles.actionButton} onClick={handleSave} aria-label="Save">
                    <HiOutlineCheck size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
      <span
          className={`${styles.labelText} ${className}`}
      >
        {currentValue}
      </span>
            {isEditable && (
                <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    onClick={handleStartEdit}
                    aria-label="Edit"
                >
                    <HiOutlinePencil size={18} />
                </button>
            )}
        </div>
    );
};

export default EditableLabel;