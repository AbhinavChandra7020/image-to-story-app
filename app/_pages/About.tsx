
"use client";

import AboutHeroSection from '@/app/_components/AboutComponents/AboutHeroSection';
import AboutTechnologyGrid from '@/app/_components/AboutComponents/AboutTechnologyGrid';
import AboutProjectAndCTA from '@/app/_components/AboutComponents/AboutCTA';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <AboutHeroSection />
      <AboutTechnologyGrid />
      <AboutProjectAndCTA />
    </div>
  );
}