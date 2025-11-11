// src/components/Applications/InputField.jsx

import React from 'react';

const InputField = ({
    id,
    label,
    type = "text",
    placeholder,
    step,
    min,
    isTextArea = false,
    options = null,
    isDisabled,
    isSaving,
    value,
    onChange,
}) => {
    const inputProps = {
        id,
        name: id,
        value: value !== undefined ? value : (type === "number" ? 0 : ""),
        onChange: onChange,
        placeholder,
        disabled: isDisabled || isSaving,
        className: "w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed transition duration-150",
        ...(type === 'number' && { type, step: step || "any", min: min || 0 }),
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={id}>
                {label}
            </label>
            {isTextArea ? (
                <textarea {...inputProps} rows="2" />
            ) : options ? (
                <select {...inputProps}>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input {...inputProps} />
            )}
        </div>
    );
};

export default InputField;