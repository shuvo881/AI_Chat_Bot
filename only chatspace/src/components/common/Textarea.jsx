import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Textarea = forwardRef(({
  value = '',
  onChange,
  placeholder,
  onKeyDown,
  className = '',
  rows = 3,
  maxLength,
  minLength,
  disabled = false,
  error = false,
  errorMessage = '',
  label,
  required = false,
  id,
  name,
  autoFocus = false,
  onFocus,
  onBlur,
  showCount = true,
  readOnly = false,
  resize = false,
}, ref) => {
  // Generate unique ID if not provided
  const uniqueId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  // Character count color logic
  const getCountColor = () => {
    if (!maxLength) return 'text-gray-500';
    const ratio = value.length / maxLength;
    if (ratio >= 0.9) return 'text-red-500';
    if (ratio >= 0.7) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <div className="relative w-full">
      {/* Label */}
      {label && (
        <label 
          htmlFor={uniqueId}
          className="block mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea Wrapper */}
      <div className="relative">
        <textarea
          ref={ref}
          id={uniqueId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
          rows={rows}
          maxLength={maxLength}
          minLength={minLength}
          disabled={disabled}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
          required={required}
          className={`
            w-full
            px-3.5
            py-2.5
            rounded-md
            border
            transition-all
            duration-200
            focus:outline-none
            focus:ring-2
            focus:ring-offset-0
            ${resize ? '' : 'resize-none'}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-200'
            }
            ${disabled 
              ? 'bg-gray-50 text-gray-500 cursor-not-allowed dark:bg-gray-800/50' 
              : 'bg-white dark:bg-gray-800'
            }
            ${readOnly 
              ? 'bg-gray-50 cursor-default dark:bg-gray-800/50' 
              : ''
            }
            ${className}
          `}
        />

        {/* Character counter */}
        {showCount && maxLength && (
          <div className={`absolute bottom-2 right-2.5 text-xs ${getCountColor()}`}>
            {value.length}/{maxLength}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Textarea.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  onKeyDown: PropTypes.func,
  className: PropTypes.string,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  autoFocus: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  showCount: PropTypes.bool,
  readOnly: PropTypes.bool,
  resize: PropTypes.bool,
};

Textarea.displayName = 'Textarea';

export default Textarea;