import React, { useState, useEffect, useRef } from 'react';
import { HiOutlinePencil, HiOutlineCheck, HiOutlineClipboardCopy } from 'react-icons/hi';
import styles from './KeywordList.module.css';

interface KeywordListProps {
    keywords: string[];
    onSave: (newKeywords: string[]) => void;
    onCopy: (keywordsText: string) => void;
    onEdit?: () => void;
    initialEditMode?: boolean;
    showBorder?: boolean;
    selectable?: boolean;
    selectedKeywords?: Set<string>;
    onKeywordSelect?: (keyword: string, isSelected: boolean) => void;
    readOnly?: boolean; // ▼▼▼ NEW PROP ▼▼▼
}

const KeywordList: React.FC<KeywordListProps> = ({
                                                     keywords,
                                                     onSave,
                                                     onCopy,
                                                     onEdit,
                                                     initialEditMode = false,
                                                     showBorder = true,
                                                     selectable = false,
                                                     selectedKeywords = new Set(),
                                                     onKeywordSelect,
                                                     readOnly = false,
                                                 }) => {
    const [isEditing, setIsEditing] = useState(initialEditMode);
    const [currentKeywordsText, setCurrentKeywordsText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const copyButtonRef = useRef<HTMLButtonElement>(null);

    const keywordsString = keywords.join('\n');

    useEffect(() => {
        setCurrentKeywordsText(keywordsString);
    }, [keywordsString]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isEditing]);

    const handleEditClick = () => {
        if (readOnly) return;
        setIsEditing(true);
        onEdit?.();
    };

    const handleSaveClick = () => {
        const newKeywords = currentKeywordsText
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        onSave(newKeywords);
        setIsEditing(false);
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(keywordsString)
            .then(() => onCopy(keywordsString))
            .catch((err) => console.error('Failed to copy keywords: ', err));
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentKeywordsText(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSaveClick();
        }
    };

    return (
        <div className={`${styles.container} ${showBorder ? styles.withBorder : ''}`}>
            <div className={styles.content}>
                <div className={styles.actions}>
                    {!isEditing ? (
                        <button
                            ref={copyButtonRef}
                            className={styles.actionButton}
                            onClick={handleCopyClick}
                            aria-label="Copy keywords to clipboard"
                        >
                            <HiOutlineClipboardCopy size={20} />
                            <span className="sr-only">Copy</span>
                        </button>
                    ) : null}

                    {/* ▼▼▼ Hide Edit button in Read-Only mode ▼▼▼ */}
                    {!readOnly && (
                        <button
                            className={styles.actionButton}
                            onClick={isEditing ? handleSaveClick : handleEditClick}
                            aria-label={isEditing ? "Save changes" : "Edit keywords"}
                        >
                            {isEditing ? <HiOutlineCheck size={20} /> : <HiOutlinePencil size={20} />}
                            <span className="sr-only">{isEditing ? "Save" : "Edit"}</span>
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        className={`${styles.textBlock} ${styles.textarea}`}
                        value={currentKeywordsText}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        aria-label="Edit keywords, one per line"
                        placeholder="Enter keywords, one per line..."
                    />
                ) : (
                    <div
                        className={`${styles.textBlock} ${styles.keywordListContainer}`}
                        // ▼▼▼ Disable double-click in Read-Only mode ▼▼▼
                        onDoubleClick={!readOnly ? handleEditClick : undefined}
                        title={!readOnly ? "Double-click to edit" : undefined}
                        style={{ cursor: readOnly ? 'default' : 'pointer' }}
                    >
                        {keywords.length > 0 ? (
                            keywords.map((keyword, index) => (
                                <div key={index} className={styles.keywordItem}>
                                    {/* ▼▼▼ Force hide checkboxes in Read-Only mode ▼▼▼ */}
                                    {selectable && !readOnly && (
                                        <input
                                            type="checkbox"
                                            className={styles.keywordCheckbox}
                                            checked={selectedKeywords.has(keyword)}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => onKeywordSelect?.(keyword, e.target.checked)}
                                        />
                                    )}
                                    <label className={styles.keywordLabel} style={{ cursor: readOnly ? 'text' : 'pointer' }}>
                                        {keyword}
                                    </label>
                                </div>
                            ))
                        ) : (
                            <span className={styles.placeholder}>
                                {readOnly ? "No keywords." : "No keywords. Double-click to add."}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KeywordList;