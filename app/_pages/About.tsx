// app/about/page.tsx
"use client";

import { AutoFixHigh, Psychology, Code, Bolt } from '@mui/icons-material';
import AboutHeroSection from '@/app/_components/AboutComponents/AboutHeroSection';
import AboutTechnologyGrid from '@/app/_components/AboutComponents/AboutTechnologyGrid';
import AboutProjectAndCTA from '@/app/_components/AboutComponents/AboutCTA';
import type { TechnologyFeature } from '@/app/_components/AboutComponents/AboutTechnologyGrid';

export default function AboutPage() {
  const stats = [
    { value: "7B+", label: "Parameters in Vision Model" },
    { value: "8B+", label: "Parameters in Language Model" },
    { value: "4", label: "Story Generation Modes" },
    { value: "∞", label: "Creative Possibilities" }
  ];

  const features: TechnologyFeature[] = [
    {
      icon: AutoFixHigh,
      title: "AI-Powered Vision",
      description: "Advanced computer vision technology analyzes your images with unprecedented accuracy, understanding context, composition, and emotional undertones.",
      technical: "Built with Qwen2.5VL:7B for image analysis and Llama3.1:8B for story generation"
    },
    {
      icon: Psychology,
      title: "Intelligent Storytelling",
      description: "Our AI doesn't just describe what it sees - it crafts compelling narratives that capture the essence and emotion of your images.",
      technical: "Multiple creativity levels and focus modes for personalized story generation"
    },
    {
      icon: Code,
      title: "Modern Architecture",
      description: "Built with cutting-edge web technologies for a seamless, responsive experience across all devices and platforms.",
      technical: "Next.js 15, TypeScript, Tailwind CSS, Material-UI, and Ollama integration"
    },
    {
      icon: Bolt,
      title: "Real-Time Processing",
      description: "Experience lightning-fast story generation with streaming responses and optimized model configurations.",
      technical: "Streaming API responses with configurable temperature and creativity parameters"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-anti_flash_white-100 via-anti_flash_white-200 to-mustard-100/30 dark:from-royal_blue_traditional-900 dark:via-royal_blue_traditional-800 dark:to-polynesian_blue-900/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-mustard-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob dark:bg-mustard-600/5" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-jonquil-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 dark:bg-jonquil-600/5" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-polynesian_blue-300/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 dark:bg-polynesian_blue-600/5" />
      </div>

      <div className="relative">
        <AboutHeroSection stats={stats} />
        <AboutTechnologyGrid features={features} />
        <AboutProjectAndCTA />
      </div>
    </div>
  );
}