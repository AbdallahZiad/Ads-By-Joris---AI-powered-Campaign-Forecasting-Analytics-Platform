import React from 'react';
import styles from './DataSourceSettings.module.css';
import SearchableSelect from '../../common/SearchableSelect/SearchableSelect';
import { SelectOption } from '../../../types';
import { COUNTRIES_OPTIONS, LANGUAGES_OPTIONS } from '../../../constants';

interface Props {
    country: SelectOption | null;
    language: SelectOption | null;
    onCountryChange: (value: SelectOption | null) => void;
    onLanguageChange: (value: SelectOption | null) => void;
}

const DataSourceSettings: React.FC<Props> = ({
                                                 country,
                                                 language,
                                                 onCountryChange,
                                                 onLanguageChange,
                                             }) => {
    return (
        <div className={styles.container}>
            <div className="flex items-center justify-between mb-1">
                <h3 className={styles.title}>Data Source Settings</h3>
            </div>

            <p className={styles.description}>
                Select the target region and language for data analysis.
            </p>

            <div className={styles.grid}>
                <div>
                    <label htmlFor="country-select" className={styles.label}>
                        Select Country:
                    </label>
                    <SearchableSelect
                        instanceId="country-select"
                        value={country}
                        onChange={onCountryChange}
                        options={COUNTRIES_OPTIONS}
                    />
                </div>
                <div>
                    <label htmlFor="language-select" className={styles.label}>
                        Select Language:
                    </label>
                    <SearchableSelect
                        instanceId="language-select"
                        value={language}
                        onChange={onLanguageChange}
                        options={LANGUAGES_OPTIONS}
                    />
                </div>
            </div>
        </div>
    );
};

export default DataSourceSettings;