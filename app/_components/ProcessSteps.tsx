"use client";

import { CloudUpload, AutoFixHigh, MenuBook, FileDownload } from '@mui/icons-material';

export default function ProcessSteps() {
  const steps = [
    {
      icon: CloudUpload,
      title: 'Upload Image',
      description: 'Upload any image to start'
    },
    {
      icon: AutoFixHigh,
      title: 'AI Magic',
      description: 'AI analyzes and creates'
    },
    {
      icon: MenuBook,
      title: 'Story Generated',
      description: 'Unique story unfolds'
    },
    {
      icon: FileDownload,
      title: 'Download',
      description: 'Save in multiple formats'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Process Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="group relative"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="bg-anti_flash_white-100/80 dark:bg-white-accent-dim backdrop-blur-sm rounded-2xl p-5 border border-anti_flash_white-300/30 dark:border-yellow-accent hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="w-10 h-10 bg-gradient-to-br from-mustard-400 to-jonquil-500 rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:rotate-12 transition-transform duration-300">
                <step.icon 
                  sx={{ 
                    fontSize: 22, 
                    color: 'var(--royal-blue-traditional-200)',
                    '.dark &': {
                      color: '#ffffff'
                    }
                  }}
                />
              </div>
              <h3 className="text-base font-bold text-royal_blue_traditional-800 dark:text-white-accent mb-1 text-center">
                {step.title}
              </h3>
              <p className="text-royal_blue_traditional-600 dark:text-white-accent text-sm text-center">
                {step.description}
              </p>
            </div>
            
            {/* Connector line for desktop */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-mustard-400 to-transparent" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}