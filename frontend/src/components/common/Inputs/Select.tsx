import React from 'react';
import { HiSelector } from 'react-icons/hi';

interface Option {
    value: string;
    label: string;
    subLabel?: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

const Select: React.FC<SelectProps> = ({
                                           value,
                                           onChange,
                                           options,
                                           placeholder = "Select...",
                                           disabled = false,
                                           className = ""
                                       }) => {
    return (
        <div className={`relative ${className}`}>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={`
                    w-full appearance-none bg-white border border-gray-300 
                    text-gray-900 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 
                    block p-2.5 pr-8 disabled:bg-gray-100 disabled:text-gray-400
                    transition-colors duration-200 cursor-pointer
                `}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label} {opt.subLabel ? `(${opt.subLabel})` : ''}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <HiSelector className="w-5 h-5" />
            </div>
        </div>
    );
};

export default Select;