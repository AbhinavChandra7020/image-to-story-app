
"use client";

import { ReactElement, ReactNode } from 'react';

interface FunctionalButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactElement;
  loading?: boolean;
  type?: 'button' | 'submit';
}

export default function FunctionalButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  type = 'button'
}: FunctionalButtonProps) {
  const baseClasses = "transition-all duration-200 rounded-lg border-2 cursor-pointer font-medium hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center space-x-2";
  
  const sizeClasses = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2 px-3 text-sm", 
    lg: "py-2.5 px-5 text-base"
  };

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-mustard-500 to-jonquil-500 
      text-royal_blue_traditional-800 
      border-mustard-500 
      hover:shadow-mustard-500/30 
      hover:border-mustard-400
    `,
    secondary: `
      bg-white dark:bg-royal_blue_traditional-700 
      text-royal_blue_traditional-800 dark:text-black 
      border-royal_blue_traditional-300 dark:border-mustard-500
      hover:bg-mustard-50 dark:hover:bg-mustard-900/20 
      hover:border-mustard-400 dark:hover:border-mustard-400
      hover:shadow-mustard-500/30
    `,
    success: `
      bg-green-600 
      text-white 
      border-green-600 
      hover:bg-green-700 
      hover:border-green-700
      hover:shadow-green-500/30
    `,
    danger: `
      bg-red-600 
      text-white 
      border-red-600 
      hover:bg-red-700 
      hover:border-red-700
      hover:shadow-red-500/30
    `,
    outline: `
      bg-transparent 
      text-royal_blue_traditional-600 dark:text-anti_flash_white-400 
      border-royal_blue_traditional-300 dark:border-mustard-500
      hover:bg-mustard-50 dark:hover:bg-mustard-900/20 
      hover:text-mustard-600 dark:hover:text-mustard-400 
      hover:border-mustard-500 dark:hover:border-mustard-400
      hover:shadow-mustard-500/30
    `
  };

  const disabledClasses = "opacity-50 cursor-not-allowed transform-none hover:shadow-none";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? disabledClasses : variantClasses[variant]}
      `}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      ) : icon ? (
        icon
      ) : null}
      <span>{children}</span>
    </button>
  );
}