import React from 'react';
import Select from 'react-select'; // Removed unused SingleValue
import { SelectOption } from '../../../types';

interface Props {
    instanceId?: string;
    value: SelectOption | null;
    onChange: (value: SelectOption | null) => void;
    options: SelectOption[];
    placeholder?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
}

const SearchableSelect: React.FC<Props> = ({
                                               instanceId,
                                               value,
                                               onChange,
                                               options,
                                               placeholder = "Select...",
                                               isLoading = false,
                                               isDisabled = false
                                           }) => {
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            borderColor: state.isFocused ? '#14b8a6' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 1px #14b8a6' : 'none',
            '&:hover': {
                borderColor: '#14b8a6'
            },
            borderRadius: '0.5rem',
            paddingTop: '2px',
            paddingBottom: '2px',
            fontSize: '0.875rem',
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#14b8a6' : state.isFocused ? '#f0fdfa' : 'white',
            color: state.isSelected ? 'white' : '#374151',
            fontSize: '0.875rem',
            cursor: 'pointer',
            ':active': {
                backgroundColor: '#0d9488',
            },
        }),
        input: (provided: any) => ({
            ...provided,
            color: '#374151',
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: '#111827',
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#9ca3af',
        }),
        menu: (provided: any) => ({
            ...provided,
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        }),
        menuPortal: (base: any) => ({ ...base, zIndex: 9999 })
    };

    const selectOptions = options.map(opt => ({
        value: opt.id,
        label: opt.name,
        original: opt
    }));

    const currentSelectValue = value
        ? { value: value.id, label: value.name }
        : null;

    return (
        <Select
            instanceId={instanceId}
            value={currentSelectValue}
            onChange={(val: any) => { // Type assertion to any/object since we stripped the generic for simplicity
                if (val) {
                    onChange({ id: val.value, name: val.label });
                } else {
                    onChange(null);
                }
            }}
            options={selectOptions}
            styles={customStyles}
            placeholder={placeholder}
            isLoading={isLoading}
            isDisabled={isDisabled}
            isClearable={false}
            menuPortalTarget={document.body}
            maxMenuHeight={150} // ▼▼▼ FIX: Limit to ~4 items (38px * 4) ▼▼▼
        />
    );
};

export default SearchableSelect;