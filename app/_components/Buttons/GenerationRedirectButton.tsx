// app/_components/Buttons/GenerationRedirectButton.tsx
"use client";

import { ArrowForward } from '@mui/icons-material';

interface GenerationRedirectButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  showArrow?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function GenerationRedirectButton({ 
  children, 
  onClick, 
  href, 
  showArrow = true, 
  className = "",
  size = 'md'
}: GenerationRedirectButtonProps) {
  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-7 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const baseClasses = `group relative ${sizeClasses[size]} bg-gradient-to-r from-mustard-500 to-jonquil-500 text-royal_blue_traditional-800 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer border-2 border-blue/50 hover:border-blue  ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {showArrow && (
        <ArrowForward 
          sx={{ fontSize: size === 'sm' ? 18 : size === 'lg' ? 22 : 20 }}
          className="group-hover:translate-x-1 transition-transform duration-300" 
        />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}