import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const Select = ({
  options = [],
  value = '',
  onChange = () => {},
  placeholder = 'Select an option...',
  disabled = false,
  className = '',
  size = 'md',
  error = false,
  label = '',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find selected option
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Size variants
  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-9 mb-2">
          {label}
          {required && <span className="text-red-6 ml-1">*</span>}
        </label>
      )}

      {/* Select Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full ${sizeStyles[size]}
          flex items-center justify-between gap-2
          bg-white border-2 rounded-lg
          ${error ? 'border-red-5' : 'border-purple-3'}
          ${disabled ? 'bg-gray-1 cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-purple-5'}
          focus:outline-none focus:ring-2 focus:ring-purple-5 focus:border-transparent
          transition-all duration-200
          text-gray-9
        `}
      >
        <span className={`${!selectedOption ? 'text-gray-6' : 'text-gray-9'} truncate`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-6 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-purple-3 rounded-lg shadow-xl z-50 max-h-60 overflow-hidden">
          {/* Search Input (if many options) */}
          {options.length > 5 && (
            <div className="p-2 border-b border-gray-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-5 focus:border-transparent text-gray-9"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-4 py-2 text-left text-sm
                    flex items-center justify-between gap-2
                    cursor-pointer text-gray-9
                    hover:bg-purple-1 hover:text-purple-6
                    focus:bg-purple-1 focus:text-purple-6
                    transition-colors duration-200
                    ${option.value === value ? 'bg-purple-1 text-purple-6' : ''}
                  `}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="w-4 h-4 text-purple-6 flex-shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-6 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
