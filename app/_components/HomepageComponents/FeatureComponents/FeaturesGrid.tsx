"use client";

import { useState } from 'react';
import { 
  CameraAlt, 
  Psychology, 
  Palette, 
  Bolt, 
  Description, 
  Language,
  SvgIconComponent 
} from '@mui/icons-material';
import FeatureCard from './FeatureCard';
import FeatureDetailsPanel from './FeatureDetailsPanel';

interface Feature {
  icon: SvgIconComponent;
  title: string;
  description: string;
  details: string[];
}

interface FeatureCardProps {
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
}

interface FeatureDetailsPanelProps {
  feature: Feature;
  activeIndex: number;
  totalFeatures: number;
  onNavigate: (index: number) => void;
}

const featuresData: Feature[] = [
  {
    icon: CameraAlt,
    title: 'Smart Image Analysis',
    description: 'The AI model deeply analyzes your images, understanding context, mood, characters, and settings to create rich, detailed story foundations.',
    details: [
      'Object and character recognition',
      'Scene composition analysis',
      'Mood and atmosphere detection',
      'Style and genre identification'
    ]
  },
  {
    icon: Psychology,
    title: 'Advanced AI Storytelling',
    description: 'Powered by cutting-edge language models that understand narrative structure, character development, and genre conventions.',
    details: [
      'Multiple story generation modes',
      'Genre-specific writing styles',
      'Character consistency tracking',
      'Plot progression management'
    ]
  },
  {
    icon: Palette,
    title: 'Customizable Creativity',
    description: 'Fine-tune your stories with adjustable creativity levels, focus modes, and genre preferences to match your vision.',
    details: [
      'Conservative to creative modes',
      'Focus on dialogue, action, or description',
      'Multiple genre options',
      'Consistency controls'
    ]
  },
  {
    icon: Bolt,
    title: 'Interactive Generation',
    description: 'Guide your story as it unfolds with interactive prompts and progressive generation for longer, more detailed narratives.',
    details: [
      'Chapter-by-chapter building',
      'User instruction integration',
      'Progressive story development',
      'Real-time story management'
    ]
  },
  {
    icon: Description,
    title: 'Multiple Export Formats',
    description: 'Download your completed stories in various formats including TXT, DOCX, and PDF with professional formatting.',
    details: [
      'Plain text files',
      'Microsoft Word documents',
      'PDF with custom styling',
      'Copy to clipboard functionality'
    ]
  },
  {
    icon: Language,
    title: 'Cross-Platform Access',
    description: 'Access ImageineIt from any device with our responsive web interface that works seamlessly across desktop and mobile.',
    details: [
      'Responsive design',
      'Mobile-optimized interface',
      'Cross-browser compatibility',
      'Progressive web app features'
    ]
  }
];

export type { Feature, FeatureCardProps, FeatureDetailsPanelProps };

export default function FeaturesGrid() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      <div className="space-y-6">
        {featuresData.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            feature={feature}
            isActive={activeFeature === index}
            onClick={() => setActiveFeature(index)}
          />
        ))}
      </div>

      <FeatureDetailsPanel
        feature={featuresData[activeFeature]}
        activeIndex={activeFeature}
        totalFeatures={featuresData.length}
        onNavigate={setActiveFeature}
      />
    </div>
  );
}