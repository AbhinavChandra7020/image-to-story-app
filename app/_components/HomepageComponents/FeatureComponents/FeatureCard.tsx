"use client";

import { SvgIconComponent } from '@mui/icons-material';
import type { FeatureCardProps } from './FeaturesGrid';

export default function FeatureCard({ feature, isActive, onClick }: FeatureCardProps) {
  const IconComponent = feature.icon;

  return (
    <div
      className={`group cursor-pointer transition-all duration-300 ${
        isActive ? 'scale-105' : 'hover:scale-102'
      }`}
      onClick={onClick}
    >
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-br from-mustard-100 to-jonquil-100 border-mustard-300 shadow-lg dark:from-mustard-900/20 dark:to-jonquil-900/20 dark:border-mustard-600/30'
          : 'bg-anti_flash_white-100 border-anti_flash_white-300 hover:border-mustard-200 dark:bg-royal_blue_traditional-800/30 dark:border-royal_blue_traditional-700 dark:hover:border-mustard-600/30'
      }`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-xl transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-br from-mustard-500 to-jonquil-500 scale-110'
              : 'bg-anti_flash_white-200 group-hover:bg-mustard-200 dark:bg-royal_blue_traditional-700 dark:group-hover:bg-mustard-600/20'
          }`}>
            <IconComponent 
              sx={{ 
                fontSize: 24,
                color: isActive ? '#ffcb05' : 'inherit'
              }}
              className={`transition-colors duration-300 ${
                isActive
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
  );
}