
"use client";

import GenerateStoryHeader from '@/app/_components/StoryGenerationComponents/GenerateStoryHeader';
import GenerateStoryWorkspace from '@/app/_components/StoryGenerationComponents/GenerateStoryWorkspace';

export function GenerateStoryPage() {
  return (
    <div className="min-h-screen">
      <GenerateStoryHeader />
      <GenerateStoryWorkspace />
    </div>
  );
}