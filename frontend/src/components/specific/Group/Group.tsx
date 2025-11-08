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
    // ▼▼▼ NEW PROPS ▼▼▼
    selectedKeywords: Set<string>;
    onKeywordSelect: (keyword: string, isSelected: boolean) => void;
    // ▲▲▲ NEW PROPS ▲▲▲
    onKeywordSave: (newKeywords: string[]) => void;
    onKeywordCopy: (keywordsText: string) => void;
    onKeywordEdit?: () => void;
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
                                     }) => {
    return (
        <Collapsible
            title={group.name}
            initialOpen={initialOpen}
            onTitleSave={onNameSave}
            onRemove={onRemove}
            containerClassName={styles.groupContainer}
            contentClassName={styles.groupContent}
            selectable={true}
            selected={selected}
            onSelect={onSelect}
            headerActions={
                <>
                    <button className={styles.actionButton} onClick={onEnrich}>
                        Enrich
                    </button>
                    <button className={styles.actionButton} onClick={onRunAnalysis}>
                        Run Analysis
                    </button>
                </>
            }
        >
            <KeywordList
                keywords={group.keywords}
                onSave={onKeywordSave}
                onCopy={onKeywordCopy}
                onEdit={onKeywordEdit}
                showBorder={false}
                // ▼▼▼ Pass selection props down ▼▼▼
                selectable={true}
                selectedKeywords={selectedKeywords}
                onKeywordSelect={onKeywordSelect}
            />
        </Collapsible>
    );
};

export default Group;