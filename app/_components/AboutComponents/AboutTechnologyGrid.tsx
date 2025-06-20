// app/_components/AboutComponents/AboutTechnologyGrid.tsx
"use client";

import { useState } from 'react';
import { SvgIconComponent } from '@mui/icons-material';

export interface TechnologyFeature {
  icon: SvgIconComponent;
  title: string;
  description: string;
  technical: string;
}

interface AboutTechnologyGridProps {
  features: TechnologyFeature[];
}

export default function AboutTechnologyGrid({ features }: AboutTechnologyGridProps) {
  const [activeFeature, setActiveFeature] = useState(0);
  const ActiveIcon = features[activeFeature].icon;

  return (
    <section className="py-20 bg-anti_flash_white-50/50 dark:bg-royal_blue_traditional-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-80px]">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-royal_blue_traditional-800 dark:text-yellow-accent mb-4">
            The Technology Behind the Magic
          </h2>
          <p className="text-lg text-royal_blue_traditional-600 dark:text-yellow-accent max-w-3xl mx-auto">
            Powered by cutting-edge AI models and modern web technologies, delivering an experience that's both powerful and intuitive.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group cursor-pointer transition-all duration-300 ${
                  activeFeature === index ? 'scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-gradient-to-br from-mustard-100 to-jonquil-100 border-mustard-300 shadow-lg dark:from-mustard-900/20 dark:to-jonquil-900/20 dark:border-mustard-600/30'
                    : 'bg-anti_flash_white-100/80 border-anti_flash_white-300 hover:border-mustard-200 dark:bg-royal_blue_traditional-800/30 dark:border-royal_blue_traditional-700 dark:hover:border-mustard-600/30'
                }`}>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      activeFeature === index
                        ? 'bg-gradient-to-br from-mustard-500 to-jonquil-500 scale-110'
                        : 'bg-anti_flash_white-200 group-hover:bg-mustard-200 dark:bg-royal_blue_traditional-700 dark:group-hover:bg-mustard-600/20'
                    }`}>
                      <feature.icon 
                        sx={{ 
                          fontSize: 24,
                          color: activeFeature === index ? '#ffcb05' : 'inherit'
                        }}
                        className={`transition-colors duration-300 ${
                          activeFeature === index
                            ? 'dark:!text-royal_blue_traditional-500'
                            : 'text-royal_blue_traditional-600 group-hover:text-mustard-600 dark:text-anti_flash_white-400 dark:group-hover:text-mustard-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-royal_blue_traditional-600 dark:text-anti_flash_white-400 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Details Panel */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl p-8 border border-anti_flash_white-300 dark:border-royal_blue_traditional-700 shadow-lg backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-xl mr-4">
                  <ActiveIcon sx={{ fontSize: 28, color: '#11296b' }} />
                </div>
                <h3 className="text-2xl font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-100">
                  {features[activeFeature].title}
                </h3>
              </div>
              <p className="text-royal_blue_traditional-600 dark:text-anti_flash_white-300 mb-6 leading-relaxed">
                {features[activeFeature].description}
              </p>
              <div className="bg-anti_flash_white-50 dark:bg-royal_blue_traditional-900/50 rounded-xl p-4 border border-anti_flash_white-300/50 dark:border-royal_blue_traditional-600/30">
                <h4 className="text-sm font-bold text-royal_blue_traditional-700 dark:text-anti_flash_white-200 uppercase tracking-wide mb-2">
                  Technical Details
                </h4>
                <p className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400 leading-relaxed">
                  {features[activeFeature].technical}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}