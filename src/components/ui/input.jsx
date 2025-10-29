import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(({
  className = '',
  type = 'text',
  size = 'md',
  error = false,
  label = '',
  required = false,
  helperText = '',
  leftIcon = null,
  rightIcon = null,
  disabled = false,
  ...props
}, ref) => {
  // Size variants
  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  // Icon sizes
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5'
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-9 mb-2">
          {label}
          {required && <span className="text-red-6 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-6 pointer-events-none">
            {React.cloneElement(leftIcon, { 
              className: cn(iconSizes[size], leftIcon.props.className) 
            })}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            // Base styles
            'w-full rounded-lg border-2 bg-white transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-purple-5 focus:border-transparent',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:text-gray-6',
            
            // Size styles
            sizeStyles[size],
            
            // Icon padding
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            
            // Error styles
            error 
              ? 'border-red-5 focus:ring-red-5' 
              : 'border-purple-3 hover:border-purple-5',
            
          // Text color
          'text-gray-8',
            
            // Custom className
            className
          )}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-6 pointer-events-none">
            {React.cloneElement(rightIcon, { 
              className: cn(iconSizes[size], rightIcon.props.className) 
            })}
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p className={cn(
          'text-sm mt-1',
          error ? 'text-red-6' : 'text-gray-6'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;