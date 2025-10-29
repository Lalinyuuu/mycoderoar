import React from 'react';
import { Loader2 } from 'lucide-react';

const IconButton = ({
  icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  tooltip = '',
  ...props
}) => {
  // Base styles with more rounded corners
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size variants with consistent sizing
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };
  
  // Icon size variants
  const iconSizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };
  
  // Color variants
  const variantStyles = {
    primary: 'bg-purple-6 hover:bg-purple-7 text-white shadow-md hover:shadow-lg hover:shadow-purple-6/25 hover:scale-105 active:scale-95 focus:ring-purple-5',
    secondary: 'bg-gray-6 hover:bg-gray-7 text-white shadow-md hover:shadow-lg hover:shadow-gray-6/25 hover:scale-105 active:scale-95 focus:ring-gray-5',
    success: 'bg-emerald-6 hover:bg-emerald-7 text-white shadow-md hover:shadow-lg hover:shadow-emerald-6/25 hover:scale-105 active:scale-95 focus:ring-emerald-5',
    danger: 'bg-red-6 hover:bg-red-7 text-white shadow-md hover:shadow-lg hover:shadow-red-6/25 hover:scale-105 active:scale-95 focus:ring-red-5',
    warning: 'bg-yellow-6 hover:bg-yellow-7 text-white shadow-md hover:shadow-lg hover:shadow-yellow-6/25 hover:scale-105 active:scale-95 focus:ring-yellow-5',
    outline: 'border-2 border-purple-6 text-purple-6 hover:bg-purple-6 hover:text-white focus:ring-purple-5',
    ghost: 'text-purple-6 hover:bg-purple-1 hover:text-purple-7 focus:ring-purple-5',
    link: 'text-purple-6 hover:text-purple-7 underline-offset-4 hover:underline focus:ring-purple-5'
  };
  
  // Loading styles
  const loadingStyles = loading ? 'cursor-wait' : '';
  
  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${loadingStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const iconClasses = `
    ${iconSizeStyles[size]}
    ${loading ? 'animate-spin' : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      title={tooltip}
      {...props}
    >
      {loading ? (
        <Loader2 className={iconClasses} />
      ) : (
        <span className="group-hover:rotate-12 transition-transform duration-300">
          {React.cloneElement(icon, { className: iconClasses })}
        </span>
      )}
    </button>
  );
};

export default IconButton;
