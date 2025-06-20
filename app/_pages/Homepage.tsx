"use client";

import HeroSection from '@/app/_components/HeroSection';
import  Features  from '@/app/_components/Features';

export function Homepage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Features />
    </div>
  );
}