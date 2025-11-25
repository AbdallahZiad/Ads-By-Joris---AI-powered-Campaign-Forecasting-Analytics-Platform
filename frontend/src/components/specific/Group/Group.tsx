import React from 'react';
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
    readOnly?: boolean; // ▼▼▼ NEW PROP ▼▼▼
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
                                     }) => {

    // ▼▼▼ Read-Only Logic Configuration ▼▼▼
    const collapsibleActions = readOnly ? null : (
        <>
            <button className={styles.actionButton} onClick={onEnrich}>
                Enrich
            </button>
            <button className={styles.actionButton} onClick={onRunAnalysis}>
                Run Analysis
            </button>
        </>
    );

    return (
        <Collapsible
            title={group.name}
            initialOpen={initialOpen}
            // If readOnly, disable title editing and removal
            onTitleSave={readOnly ? undefined : onNameSave}
            onRemove={readOnly ? undefined : onRemove}
            containerClassName={styles.groupContainer}
            contentClassName={styles.groupContent}
            // If readOnly, disable selection
            selectable={!readOnly}
            selected={selected}
            onSelect={onSelect}
            headerActions={collapsibleActions}
        >
            <KeywordList
                keywords={group.keywords}
                onSave={onKeywordSave}
                onCopy={onKeywordCopy}
                onEdit={onKeywordEdit}
                showBorder={false}
                selectable={true}
                selectedKeywords={selectedKeywords}
                onKeywordSelect={onKeywordSelect}
                readOnly={readOnly} // Pass it down
            />
        </Collapsible>
    );
};

export default Group;