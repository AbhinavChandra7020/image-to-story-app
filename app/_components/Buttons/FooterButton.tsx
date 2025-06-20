// app/_components/Buttons/FooterButton.tsx
"use client";

import { LucideIcon } from 'lucide-react';

interface FooterButtonProps {
  href: string;
  icon: LucideIcon;
  name: string;
  hoverColor?: string;
  size?: number;
  className?: string;
}

export default function FooterButton({ 
  href, 
  icon: Icon, 
  name, 
  hoverColor = 'hover:text-white',
  size = 24,
  className = ""
}: FooterButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`p-3 rounded-lg bg-royal_blue_traditional-800/50 text-anti_flash_white-400 transition-all duration-300 cursor-pointer ${hoverColor} hover:bg-royal_blue_traditional-700/50 hover:scale-110 ${className}`}
      aria-label={name}
    >
      <Icon size={size} />
    </a>
  );
}