// app/_components/Button.tsx
"use client";

import { ArrowForward } from '@mui/icons-material';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  showArrow?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function HomepageButton({ 
  children, 
  onClick, 
  href, 
  showArrow = true, 
  className = "",
  size = 'md'
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg'
  };

  const baseClasses = `group relative ${sizeClasses[size]} bg-gradient-to-r from-mustard-500 to-jonquil-500 text-royal_blue_traditional-800 font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer border-2 border-white/50 hover:border-white ${className}`;

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