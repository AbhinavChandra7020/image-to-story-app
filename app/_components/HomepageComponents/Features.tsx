"use client";

import { AutoFixHigh, Tune } from '@mui/icons-material';
import SectionHeader from '@/app/_components/HomepageComponents/FeatureComponents/SectionHeader';
import FeaturesGrid from '@/app/_components/HomepageComponents/FeatureComponents/FeaturesGrid';

export default function Features() {
  return (
    <section className="py-12 bg-anti_flash_white-50 dark:bg-royal_blue_traditional-900/50 -mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={AutoFixHigh}
          title="Powerful Features"
          description="Everything you need to transform your images into compelling stories, from AI-powered analysis to professional exports."
        />

        <FeaturesGrid />
      </div>
    </section>
  );
}