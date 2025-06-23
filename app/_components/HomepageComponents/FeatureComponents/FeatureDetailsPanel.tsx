"use client";

import type { FeatureDetailsPanelProps } from './FeaturesGrid';

export default function FeatureDetailsPanel({ 
  feature, 
  activeIndex, 
  totalFeatures, 
  onNavigate 
}: FeatureDetailsPanelProps) {
  const IconComponent = feature.icon;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-anti_flash_white-100 dark:bg-royal_blue_traditional-800/50 rounded-2xl p-8 border border-anti_flash_white-300 dark:border-royal_blue_traditional-700 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-xl mr-4">
            <IconComponent sx={{ fontSize: 28, color: '#11296b' }} />
          </div>
          <h3 className="text-2xl font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-100">
            {feature.title}
          </h3>
        </div>
        
        <p className="text-royal_blue_traditional-600 dark:text-anti_flash_white-300 mb-6 leading-relaxed">
          {feature.description}
        </p>
        
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-royal_blue_traditional-700 dark:text-anti_flash_white-200 uppercase tracking-wide">
            Key Capabilities
          </h4>
          <ul className="space-y-2">
            {feature.details.map((detail, index) => (
              <li key={index} className="flex items-center text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
                <div className="w-1.5 h-1.5 bg-mustard-500 rounded-full mr-3 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalFeatures }).map((_, index) => (
          <button
            key={index}
            onClick={() => onNavigate(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? 'bg-mustard-500 scale-125'
                : 'bg-anti_flash_white-300 hover:bg-mustard-300 dark:bg-royal_blue_traditional-600 dark:hover:bg-mustard-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}