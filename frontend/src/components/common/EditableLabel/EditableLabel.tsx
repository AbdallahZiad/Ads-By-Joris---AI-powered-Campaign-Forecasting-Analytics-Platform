import React, { useState, useEffect, useRef } from 'react';
import { HiOutlinePencil, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import styles from './EditableLabel.module.css';

interface EditableLabelProps {
    initialValue: string;
    onSave: (newValue: string) => void;
    isEditable?: boolean;
    onRemove?: () => void;
    className?: string;
    inputClassName?: string;
}

const EditableLabel: React.FC<EditableLabelProps> = ({
                                                         initialValue,
                                                         onSave,
                                                         isEditable = true,
                                                         onRemove,
                                                         className = '',
                                                         inputClassName = '',
                                                     }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setCurrentValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleStartEdit = (e?: React.MouseEvent) => {
        if (!isEditable) return;
        e?.stopPropagation();
        setIsEditing(true);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Optional: Add a confirmation dialog here if desired in the future
        onRemove?.();
    };

    const handleSave = (e?: React.MouseEvent | React.FocusEvent) => {
        e?.stopPropagation();
        const trimmed = currentValue.trim();
        if (trimmed && trimmed !== initialValue) {
            onSave(trimmed);
        } else {
            setCurrentValue(initialValue);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setIsEditing(false);
            setCurrentValue(initialValue);
        }
    };

    if (isEditing) {
        return (
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <input
                    ref={inputRef}
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className={`${styles.input} ${className} ${inputClassName}`}
                    onClick={(e) => e.stopPropagation()}
                />
                <button className={styles.actionButton} onMouseDown={handleSave} aria-label="Save">
                    {/* Use onMouseDown for save to fire before onBlur */}
                    <HiOutlineCheck size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
      <span
          className={`${styles.labelText} ${className}`}
          title={isEditable ? "Click to edit" : undefined}
      >
        {currentValue}
      </span>

            {/* Edit Pencil */}
            {isEditable && (
                <button
                    className={`${styles.hoverButton} ${styles.standard}`}
                    onClick={handleStartEdit}
                    aria-label="Edit"
                >
                    <HiOutlinePencil size={18} />
                </button>
            )}

            {onRemove && (
                <button
                    className={`${styles.hoverButton} ${styles.destructive}`}
                    onClick={handleRemove}
                    aria-label="Remove"
                    title="Remove"
                >
                    <HiOutlineX size={18} />
                </button>
            )}
        </div>
    );
};

export default EditableLabel;