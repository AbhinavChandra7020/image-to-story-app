
import { ReactElement, MouseEvent, FormEvent } from 'react';

interface IconButtonProps {
  icon: ReactElement;
  onClick?: (e?: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>) => void;
  title?: string;
  disabled?: boolean;
  variant?: 'default' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
}

export default function IconButton({
  icon,
  onClick,
  title,
  disabled = false,
  variant = 'default',
  size = 'md',
  type = 'button'
}: IconButtonProps) {
  const baseClasses = "transition-all duration-200 rounded-lg border-2 cursor-pointer hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center";

  const sizeClasses = {
    sm: "p-1",
    md: "p-1.5", 
    lg: "p-2"
  };

  const variantClasses = {
    default: `text-royal_blue_traditional-600 dark:text-anti_flash_white-400 border-royal_blue_traditional-300 dark:border-mustard-500 hover:text-mustard-600 dark:hover:text-mustard-400 hover:border-mustard-500 dark:hover:border-mustard-400 hover:shadow-mustard-500/30 dark:hover:shadow-mustard-400/30 [&>*]:hover:drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]`,
    success: `text-green-600 border-green-300 dark:border-green-500 hover:text-green-700 hover:border-green-500 dark:hover:border-green-400 hover:shadow-green-500/30 [&>*]:hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]`,
    danger: `text-red-600 border-red-300 dark:border-red-500 hover:text-red-700 hover:border-red-500 dark:hover:border-red-400 hover:shadow-red-500/30 [&>*]:hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]`
  };

  const disabledClasses = "opacity-50 cursor-not-allowed transform-none hover:shadow-none [&>*]:hover:drop-shadow-none";

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      title={title}
      className={`${baseClasses} ${sizeClasses[size]} ${disabled ? disabledClasses : variantClasses[variant]}`}
    >
      {icon}
    </button>
  );
}
