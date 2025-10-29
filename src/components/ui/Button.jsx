import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon = null,
  ...props
}) => {
  // Base styles with more rounded corners
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size variants with consistent sizing
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm h-8 min-w-[80px]',
    md: 'px-6 py-3 text-sm h-10 min-w-[100px]',
    lg: 'px-8 py-4 text-base h-12 min-w-[120px]',
    xl: 'px-10 py-5 text-lg h-14 min-w-[140px]'
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
  
  // Icon styles
  const iconStyles = icon ? 'gap-2' : '';
  
  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${loadingStyles}
    ${iconStyles}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!loading && icon && (
        <span className="group-hover:rotate-12 transition-transform duration-300">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
