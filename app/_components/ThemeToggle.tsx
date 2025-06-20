"use client";

import { useTheme } from './ThemeProvider';
import { LightMode, DarkMode } from '@mui/icons-material';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-anti_flash_white-400/20 backdrop-blur-sm border border-anti_flash_white-300/30 text-royal_blue_traditional-500 transition-all duration-300 hover:bg-anti_flash_white-300/30 hover:scale-105 dark:bg-royal_blue_traditional-800/30 dark:border-royal_blue_traditional-700/30 dark:text-anti_flash_white-300 dark:hover:bg-royal_blue_traditional-700/40"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative">
        <LightMode 
          sx={{ fontSize: 18 }}
          className={`absolute transition-all duration-300 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 opacity-100' 
              : 'rotate-90 scale-0 opacity-0'
          }`} 
        />
        <DarkMode 
          sx={{ fontSize: 18 }}
          className={`absolute transition-all duration-300 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          }`} 
        />
      </div>
      
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-mustard-300/20 to-jonquil-300/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </button>
  );
}