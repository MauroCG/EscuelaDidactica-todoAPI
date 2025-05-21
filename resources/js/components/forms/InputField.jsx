import React from 'react';

const InputField = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    error, // Optional: to display individual field errors
    className = '', // Allow passing additional classes to the input
    labelClassName = '',
    wrapperClassName = 'mb-4', // Default margin bottom for the field group
}) => {
    return (
        <div className={wrapperClassName}>
            <label htmlFor={id} className={`block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1 ${labelClassName}`}>
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent 
                            bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 
                            sm:text-sm disabled:opacity-60 dark:disabled:opacity-50 
                            placeholder-slate-400 dark:placeholder-slate-500 
                            transition-colors transition-shadow duration-150 ease-in-out ${className}`} // Added transition
            />
            {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1 transition-opacity duration-300 ease-in-out">{error}</p>} 
            {/* Added transition to error, though visibility is usually controlled by conditional rendering */}
        </div>
    );
};

export default React.memo(InputField); // Wrapped with React.memo
