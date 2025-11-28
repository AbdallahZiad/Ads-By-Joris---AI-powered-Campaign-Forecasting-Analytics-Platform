import React from 'react';
import { HiPlus } from 'react-icons/hi';
import styles from '../CategoryManagement.module.css';

interface Props {
    onAddCategory: () => void;
}

const CategoryHeader: React.FC<Props> = ({ onAddCategory }) => {
    return (
        <div className={styles.pageHeader}>
            <h1 className="text-2xl font-bold text-gray-800">Category Planner</h1>
            <button className={styles.primaryButton} onClick={onAddCategory}>
                <HiPlus size={16} className="mr-1" />
                Add Category
            </button>
        </div>
    );
};

export default CategoryHeader;