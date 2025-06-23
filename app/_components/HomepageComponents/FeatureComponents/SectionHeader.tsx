"use client";

import { SvgIconComponent } from '@mui/icons-material';

interface SectionHeaderProps {
  icon: SvgIconComponent;
  title: string;
  description: string;
  className?: string;
}

export default function SectionHeader({ 
  icon: IconComponent, 
  title, 
  description, 
  className = "" 
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-10 ${className}`}>
      <div className="flex items-center justify-center mb-3">
        <IconComponent sx={{ fontSize: 32, color: '#ffdb57', marginRight: 1 }} />
        <h2 className="text-3xl sm:text-4xl font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-100">
          {title}
        </h2>
      </div>
      <p className="text-lg text-royal_blue_traditional-600 dark:text-anti_flash_white-300 max-w-3xl mx-auto">
        {description}
      </p>
    </div>
  );
}