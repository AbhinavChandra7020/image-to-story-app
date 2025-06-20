"use client";

import { Github, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'GitHub', 
      href: 'https://github.com/yourusername', // Replace with your GitHub URL
      icon: Github,
      hoverColor: 'hover:text-gray-900 dark:hover:text-white'
    },
    { 
      name: 'LinkedIn', 
      href: 'https://linkedin.com/in/yourusername', // Replace with your LinkedIn URL
      icon: Linkedin,
      hoverColor: 'hover:text-blue-400'
    }
  ];

  return (
    <footer className="bg-royal_blue_traditional-900 dark:bg-royal_blue_traditional-950 text-anti_flash_white-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Brand Section */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/logo.png" 
                alt="ImageineIt Logo" 
                className="h-10 w-auto object-contain"
              />
              <h3 className="text-2xl font-bold text-yellow-accent dark:text-yellow-accent">
                ImageineIt
              </h3>
            </div>
            <p className="text-anti_flash_white-400 mb-6 leading-relaxed max-w-md mx-auto">
              Transform your images into captivating stories with the power of AI. 
              Every picture has a tale to tell, and we help you discover it.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg bg-royal_blue_traditional-800/50 text-anti_flash_white-400 transition-all duration-300 ${social.hoverColor} hover:bg-royal_blue_traditional-700/50 hover:scale-110`}
                  aria-label={social.name}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-royal_blue_traditional-800 bg-royal_blue_traditional-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="text-anti_flash_white-500 text-sm">
              Powered by Ollama • Built for Creativity
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}