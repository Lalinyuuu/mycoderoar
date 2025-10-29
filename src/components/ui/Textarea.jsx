import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Textarea = forwardRef(({
  className = '',
  size = 'md',
  error = false,
  label = '',
  required = false,
  helperText = '',
  disabled = false,
  rows = 3,
  ...props
}, ref) => {
  // Size variants
  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-3 text-base'
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

      {/* Textarea Field */}
      <textarea
        ref={ref}
        disabled={disabled}
        rows={rows}
        className={cn(
          // Base styles
          'w-full rounded-lg border-2 bg-white transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-purple-5 focus:border-transparent',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          'placeholder:text-gray-6 resize-none',
          
          // Size styles
          sizeStyles[size],
          
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

Textarea.displayName = 'Textarea';

export default Textarea;
