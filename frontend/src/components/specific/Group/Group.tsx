import React from 'react';
import Collapsible from '../../common/Collapsable/Collapsible';
import KeywordList from '../../specific/KeywordList/KeywordList';
import { Group as GroupType } from '../../../types';
import styles from './Group.module.css';

interface GroupProps {
    group: GroupType;
    initialOpen?: boolean;
    // Selection props
    selected: boolean;
    onSelect: (isSelected: boolean) => void;
    // Action props
    onNameSave: (newName: string) => void;
    onEnrich: () => void;
    onRunAnalysis: () => void;
    onKeywordSave: (newKeywords: string[]) => void;
    onKeywordCopy: (keywordsText: string) => void;
    onKeywordEdit?: () => void;
}

const Group: React.FC<GroupProps> = ({
                                         group,
                                         initialOpen = false,
                                         selected,
                                         onSelect,
                                         onNameSave,
                                         onEnrich,
                                         onRunAnalysis,
                                         onKeywordSave,
                                         onKeywordCopy,
                                         onKeywordEdit,
                                     }) => {
    return (
        <Collapsible
            title={group.name}
            initialOpen={initialOpen}
            onTitleSave={onNameSave}
            containerClassName={styles.groupContainer}
            contentClassName={styles.groupContent}
            // Enable selection for Groups
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
            />
        </Collapsible>
    );
};

export default Group;