import React from 'react';
import Select, { StylesConfig } from 'react-select';
import { HiOutlineSelector } from 'react-icons/hi';

// A generic option type this component will accept
export interface SelectOption {
    id: string; // react-select uses 'value' by default, but we can map it
    name: string; // react-select uses 'label' by default, but we can map it
}

interface Props {
    value: SelectOption | null;
    options: SelectOption[];
    onChange: (value: SelectOption | null) => void;
    instanceId: string; // Important for accessibility and SSR
}

// --- Custom Styles Object to match our app's aesthetic ---
const customStyles: StylesConfig<SelectOption, false> = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: 'white',
        borderColor: state.isFocused ? '#14b8a6' : '#d1d5db', // gray-300 or teal-500
        boxShadow: state.isFocused ? '0 0 0 1px #14b8a6' : 'none',
        borderRadius: '0.375rem', // rounded-md
        padding: '0.15rem', // a little padding
        minHeight: '42px',
        fontSize: '0.875rem', // text-sm
        '&:hover': {
            borderColor: state.isFocused ? '#14b8a6' : '#9ca3af', // gray-400
        },
    }),
    valueContainer: (provided) => ({
        ...provided,
        padding: '0 0.5rem',
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#1f2937', // text-gray-900
    }),
    input: (provided) => ({
        ...provided,
        margin: '0',
        padding: '0',
        color: '#1f2937',
    }),
    indicatorSeparator: () => ({
        display: 'none', // Remove the vertical line
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: '#9ca3af', // text-gray-400
        padding: '0.5rem',
        '&:hover': {
            color: '#4b5563', // text-gray-600
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'white',
        borderRadius: '0.375rem', // rounded-md
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', // shadow-lg
        marginTop: '4px',
        zIndex: 20,
    }),
    menuList: (provided) => ({
        ...provided,
        padding: '0.25rem', // py-1
        maxHeight: '240px',
    }),
    option: (provided, state) => ({
        ...provided,
        fontSize: '0.875rem',
        borderRadius: '0.25rem',
        padding: '0.5rem 0.75rem',
        cursor: 'pointer',
        backgroundColor: state.isSelected
            ? '#f0fdfa' // teal-50
            : state.isFocused
                ? '#ccfbf1' // teal-100
                : 'white',
        color: state.isSelected ? '#0f766e' : '#1f2937', // teal-700 : text-gray-900
        fontWeight: state.isSelected ? 600 : 400,
        '&:hover': {
            backgroundColor: state.isSelected ? '#f0fdfa' : '#ccfbf1',
            color: state.isSelected ? '#0f766e' : '#111827',
        },
    }),
};

// Custom Chevron component
const DropdownIndicator = (props: any) => {
    return (
        <div {...props.innerProps} className="text-gray-400 hover:text-gray-600 p-2">
            <HiOutlineSelector size={20} />
        </div>
    );
};

const SearchableSelect: React.FC<Props> = ({ value, options, onChange, instanceId }) => {
    return (
        <Select
            instanceId={instanceId}
            options={options}
            value={value}
            onChange={onChange}
            // Map our custom prop names to react-select's internal names
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.name}
            // Apply all our custom styles
            styles={customStyles}
            // Hide the default chevron and use our own for consistent icon styling
            components={{ DropdownIndicator }}
        />
    );
};

export default SearchableSelect;