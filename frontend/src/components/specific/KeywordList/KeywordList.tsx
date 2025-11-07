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
    // showPadding prop has been removed
}

const KeywordList: React.FC<KeywordListProps> = ({
                                                     keywords,
                                                     onSave,
                                                     onCopy,
                                                     onEdit,
                                                     initialEditMode = false,
                                                     showBorder = true,
                                                     // showPadding prop has been removed
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
            .then(() => {
                onCopy(keywordsString);
                if (copyButtonRef.current) {
                    copyButtonRef.current.focus();
                }
            })
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
                {/* Actions are z-10 */}
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
                    <button
                        className={styles.actionButton}
                        onClick={isEditing ? handleSaveClick : handleEditClick}
                        aria-label={isEditing ? "Save changes" : "Edit keywords"}
                    >
                        {isEditing ? <HiOutlineCheck size={20} /> : <HiOutlinePencil size={20} />}
                        <span className="sr-only">{isEditing ? "Save" : "Edit"}</span>
                    </button>
                </div>

                {/* Ternary logic restored */}
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
                    <pre
                        className={`${styles.textBlock} ${styles.keywordList}`}
                        onDoubleClick={handleEditClick}
                        title="Double-click to edit"
                    >
            {keywords.length > 0 ? (
                keywordsString
            ) : (
                <span className={styles.placeholder}>
                No keywords. Double-click to add.
              </span>
            )}
          </pre>
                )}
            </div>
        </div>
    );
};

export default KeywordList;