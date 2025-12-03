import React, { useState, useEffect, useRef } from 'react';
import { HiOutlinePencil, HiOutlineCheck, HiOutlineClipboardCopy, HiRefresh } from 'react-icons/hi';
import styles from './KeywordList.module.css';
import { Keyword } from '../../../types'; // Import the object type

interface KeywordListProps {
    keywords: Keyword[]; // ▼▼▼ Changed from string[] to Keyword[]
    onSave: (newKeywords: string[]) => void;
    onCopy: (keywordsText: string) => void;
    onEdit?: () => void;
    initialEditMode?: boolean;
    showBorder?: boolean;
    selectable?: boolean;
    selectedKeywords?: Set<string>;
    onKeywordSelect?: (keyword: string, isSelected: boolean) => void;
    readOnly?: boolean;
    isEnriching?: boolean;
    newKeywords?: Set<string>;
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
                                                     isEnriching = false,
                                                     newKeywords = new Set(),
                                                 }) => {
    const [isEditing, setIsEditing] = useState(initialEditMode);
    const [currentKeywordsText, setCurrentKeywordsText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Convert objects to string for editing/copying
    const keywordsString = keywords.map(k => k.text).join('\n');

    useEffect(() => {
        setCurrentKeywordsText(keywordsString);
    }, [keywordsString]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isEditing]);

    const handleEditClick = () => {
        if (readOnly || isEnriching) return;
        setIsEditing(true);
        onEdit?.();
    };

    const handleSaveClick = () => {
        const newLines = currentKeywordsText
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        onSave(newLines);
        setIsEditing(false);
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(keywordsString)
            .then(() => onCopy(keywordsString))
            .catch((err) => console.error('Failed to copy keywords: ', err));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSaveClick();
        }
    };

    return (
        <div className={`${styles.container} ${showBorder ? styles.withBorder : ''}`}>
            {isEnriching && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loadingContent}>
                        <HiRefresh className="animate-spin text-teal-500" size={24} />
                        <span className="text-sm font-medium text-teal-700">Enriching...</span>
                    </div>
                </div>
            )}

            <div className={styles.content}>
                <div className={styles.actions}>
                    {!isEditing ? (
                        <button
                            className={styles.actionButton}
                            onClick={handleCopyClick}
                            aria-label="Copy keywords to clipboard"
                        >
                            <HiOutlineClipboardCopy size={20} />
                        </button>
                    ) : null}

                    {!readOnly && (
                        <button
                            className={styles.actionButton}
                            onClick={isEditing ? handleSaveClick : handleEditClick}
                            disabled={isEnriching}
                        >
                            {isEditing ? <HiOutlineCheck size={20} /> : <HiOutlinePencil size={20} />}
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <textarea
                        ref={textareaRef}
                        className={`${styles.textBlock} ${styles.textarea}`}
                        value={currentKeywordsText}
                        onChange={(e) => setCurrentKeywordsText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter keywords, one per line..."
                    />
                ) : (
                    <div
                        className={`${styles.textBlock} ${styles.keywordListContainer}`}
                        onDoubleClick={!readOnly && !isEnriching ? handleEditClick : undefined}
                        style={{ cursor: readOnly || isEnriching ? 'default' : 'pointer' }}
                    >
                        {keywords.length > 0 ? (
                            keywords.map((kwObj) => {
                                // ▼▼▼ FIX: Access .text property instead of rendering object ▼▼▼
                                const isNew = newKeywords.has(kwObj.text);

                                return (
                                    <div
                                        key={kwObj.id} // Use ID for key
                                        className={`${styles.keywordItem} ${isNew ? styles.newKeyword : ''}`}
                                    >
                                        {selectable && !readOnly && (
                                            <input
                                                type="checkbox"
                                                className={styles.keywordCheckbox}
                                                checked={selectedKeywords.has(kwObj.text)}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={(e) => onKeywordSelect?.(kwObj.text, e.target.checked)}
                                            />
                                        )}
                                        <label className={styles.keywordLabel} style={{ cursor: readOnly ? 'text' : 'pointer' }}>
                                            {kwObj.text}
                                            {isNew && <span className={styles.newBadge}>New</span>}
                                        </label>
                                    </div>
                                );
                            })
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