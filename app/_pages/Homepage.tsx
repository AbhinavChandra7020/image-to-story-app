
"use client";

import HeroSection from '@/app/_components/HomepageComponents/HeroSection';
import  Features  from '@/app/_components/HomepageComponents/Features';

export function Homepage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Features />
    </div>
  );
}