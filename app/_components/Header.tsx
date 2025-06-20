"use client";

import { useState } from 'react';
import { Menu, Close } from '@mui/icons-material';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Create Story', href: '/create' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-anti_flash_white-100/80 backdrop-blur-md border-b border-anti_flash_white-300/30 dark:bg-royal_blue_traditional-900/80 dark:border-royal_blue_traditional-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3 group">
              <img 
                src="/logo.png" 
                alt="ImageineIt Logo" 
                className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <h1 className="text-xl font-bold text-yellow-accent dark:text-yellow-accent transition-colors duration-300">
                ImageineIt
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-royal_blue_traditional-700 hover:text-polynesian_blue-600 transition-colors duration-200 font-medium relative group dark:text-yellow-accent dark:hover:text-mustard-400"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-mustard-500 to-jonquil-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center">
              <ThemeToggle />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-anti_flash_white-400/20 text-royal_blue_traditional-600 hover:bg-anti_flash_white-300/30 transition-colors duration-200 dark:bg-royal_blue_traditional-800/30 dark:text-anti_flash_white-300 dark:hover:bg-royal_blue_traditional-700/40"
            >
              {isMenuOpen ? <Close sx={{ fontSize: 20 }} /> : <Menu sx={{ fontSize: 20 }} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? 'max-h-64 opacity-100' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <nav className="py-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-royal_blue_traditional-700 hover:text-polynesian_blue-600 hover:bg-anti_flash_white-200/50 rounded-lg transition-all duration-200 font-medium dark:text-yellow-accent dark:hover:text-mustard-400 dark:hover:bg-yellow-accent-dim"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}