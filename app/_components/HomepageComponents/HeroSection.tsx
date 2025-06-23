"use client";

import { useState, useEffect } from 'react';
import ProcessSteps from '@/app/_components/HomepageComponents/ProcessSteps';
import GenerationRedirectButton from '@/app/_components/Buttons/GenerationRedirectButton';

export default function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Imagine', 'Create', 'Tell', 'Share'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-anti_flash_white-100 via-anti_flash_white-200 to-mustard-100/30 dark:from-royal_blue_traditional-900 dark:via-royal_blue_traditional-800 dark:to-polynesian_blue-900/30">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-mustard-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob dark:bg-mustard-600/10" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-jonquil-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 dark:bg-jonquil-600/10" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-polynesian_blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 dark:bg-polynesian_blue-600/10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 -mt-8">
        <div className="mb-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-4">
            <span className="block text-royal_blue_traditional-800 dark:text-yellow-accent">
              Turn Images Into
            </span>
            <span className="block relative">
              <span className="bg-gradient-to-r from-mustard-500 to-jonquil-500 bg-clip-text text-transparent">
                {words.map((word, index) => (
                  <span
                    key={word}
                    className={`absolute inset-0 transition-all duration-500 ${
                      index === currentWord
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    {word}
                  </span>
                ))}
                <span className="opacity-0">{words[0]}</span>
              </span>
              <span className="text-royal_blue_traditional-800 dark:text-yellow-accent ml-4">
                Stories
              </span>
            </span>
            <span className="block text-lg sm:text-xl lg:text-2xl font-medium text-royal_blue_traditional-600 dark:text-yellow-accent mt-2">
              Every picture has a tale to tell.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-royal_blue_traditional-600 dark:text-yellow-accent max-w-3xl mx-auto leading-relaxed">
            Upload any image and watch as the AI transforms it into captivating stories. 
            From fantasy adventures to sci-fi thrillers, every picture has a tale to tell.
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <GenerationRedirectButton href="/generate-story">Start Creating</GenerationRedirectButton>
        </div>

        <ProcessSteps />
      </div>
    </section>
  );
}