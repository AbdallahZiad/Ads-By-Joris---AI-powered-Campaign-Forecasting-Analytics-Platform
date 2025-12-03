import React from 'react';
import { HiRefresh } from 'react-icons/hi';
import Collapsible from '../../common/Collapsible/Collapsible';
import KeywordList from '../../specific/KeywordList/KeywordList';
import { Group as GroupType } from '../../../types';
import styles from './Group.module.css';

interface GroupProps {
    group: GroupType;
    initialOpen?: boolean;
    selected: boolean;
    onSelect: (isSelected: boolean) => void;
    onRemove: () => void;
    onNameSave: (newName: string) => void;
    onEnrich: () => void;
    onRunAnalysis: () => void;
    selectedKeywords: Set<string>;
    onKeywordSelect: (keyword: string, isSelected: boolean) => void;
    onKeywordSave: (newKeywords: string[]) => void;
    onKeywordCopy: (keywordsText: string) => void;
    onKeywordEdit?: () => void;
    readOnly?: boolean;
    isEnriching?: boolean;
    newKeywords?: Set<string>;
}

const Group: React.FC<GroupProps> = ({
                                         group,
                                         initialOpen = false,
                                         selected,
                                         onSelect,
                                         onRemove,
                                         onNameSave,
                                         onEnrich,
                                         onRunAnalysis,
                                         selectedKeywords,
                                         onKeywordSelect,
                                         onKeywordSave,
                                         onKeywordCopy,
                                         onKeywordEdit,
                                         readOnly = false,
                                         isEnriching = false,
                                         newKeywords = new Set(),
                                     }) => {

    const hasKeywords = group.keywords.length > 0;

    const collapsibleActions = readOnly ? null : (
        <>
            <button className={styles.actionButton} onClick={onEnrich} disabled={isEnriching}>
                Enrich
            </button>
            <button
                className={styles.actionButton}
                onClick={onRunAnalysis}
                disabled={!hasKeywords}
            >
                Run Analysis
            </button>
        </>
    );

    const statusIndicator = isEnriching ? (
        <div className="flex items-center text-teal-600" title="Enriching in progress...">
            <HiRefresh className="animate-spin" size={18} />
        </div>
    ) : null;

    return (
        <Collapsible
            title={group.name}
            initialOpen={initialOpen}
            onTitleSave={readOnly ? undefined : onNameSave}
            onRemove={readOnly ? undefined : onRemove}
            containerClassName={styles.groupContainer}
            contentClassName={styles.groupContent}
            selectable={!readOnly}
            selected={selected}
            onSelect={onSelect}
            headerActions={collapsibleActions}
            statusIndicator={statusIndicator}
        >
            <KeywordList
                keywords={group.keywords} // Correctly passed as Keyword[]
                onSave={onKeywordSave}
                onCopy={onKeywordCopy}
                onEdit={onKeywordEdit}
                showBorder={false}
                selectable={true}
                selectedKeywords={selectedKeywords}
                onKeywordSelect={onKeywordSelect}
                readOnly={readOnly}
                isEnriching={isEnriching}
                newKeywords={newKeywords}
            />
        </Collapsible>
    );
};

export default Group;