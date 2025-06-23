
"use client";

import { useState, useRef, useEffect } from 'react';
import { AutoFixHigh, Timeline, Stop, PlayArrow } from '@mui/icons-material';
import type { StorySettings } from './StorySettingsPanel';
import FunctionalButton from '@/app/_components/Buttons/FunctionalButton';
import IconButton from '@/app/_components/Buttons/IconButton';

interface OneShotStoryGenerationProps {
  caption: string;
  settings: StorySettings;
  onStoryUpdate: (story: string) => void;
  targetWordCount: number;
}

interface GenerationProgress {
  currentWords: number;
  targetWords: number;
  chunksGenerated: number;
  isComplete: boolean;
  percentage: number;
}

export default function OneShotStoryGeneration({
  caption,
  settings,
  onStoryUpdate,
  targetWordCount
}: OneShotStoryGenerationProps) {
  const [story, setStory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [shouldStop, setShouldStop] = useState(false);
  const [progress, setProgress] = useState<GenerationProgress>({
    currentWords: 0,
    targetWords: targetWordCount,
    chunksGenerated: 0,
    isComplete: false,
    percentage: 0
  });
  const [generationLog, setGenerationLog] = useState<string[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  
  const storyRef = useRef<HTMLDivElement>(null);

  const addToLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setGenerationLog(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const updateProgress = (currentStory: string) => {
    const wordCount = currentStory.trim().split(/\s+/).filter(word => word.length > 0).length;
    const percentage = Math.min(100, (wordCount / targetWordCount) * 100);
    
    setProgress(prev => ({
      ...prev,
      currentWords: wordCount,
      percentage,
      isComplete: wordCount >= targetWordCount
    }));
  };

  const generateStoryChunk = async (instruction: "start" | "continue" | "conclusion" | "final") => {
    try {
      const response = await fetch("/api/story/one-shot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          genre: settings.genre,
          storySoFar: story,
          chunkTarget: settings.chunkTarget,
          instruction,
          focusMode: settings.focusMode,
          creativityLevel: settings.creativityLevel,
          consistencyMode: settings.consistencyMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to generate story chunk`);
      }

      const data = await response.json();
      return data.story || "";
    } catch (error) {
      console.error("Story chunk generation failed:", error);
      throw error;
    }
  };

  const startStoryGeneration = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setHasStarted(true);
    setShowProgress(true);
    setShouldStop(false);
    setStory("");
    setGenerationLog([]);
    
    addToLog("Starting one-shot story generation...");
    
    let currentStory = "";
    let chunkCount = 0;

    try {
      while (true) {
        if (shouldStop) {
          addToLog("⏹️ Generation stopped by user");
          break;
        }

        const currentWordCount = currentStory.trim().split(/\s+/).filter(word => word.length > 0).length;
        
        // progress instruction
        let instruction: "start" | "continue" | "conclusion" | "final";
        const progressPercentage = currentWordCount / targetWordCount;
        
        if (chunkCount === 0) {
          instruction = "start";
          addToLog(`Generating opening chapter (Target: ${settings.chunkTarget} words)`);
        } else if (progressPercentage >= 0.9) {
          instruction = "final";
          addToLog(`Generating final chapter to complete the story`);
        } else if (progressPercentage >= 0.75) {
          instruction = "conclusion";
          addToLog(`Generating conclusion chapter (${(progressPercentage * 100).toFixed(1)}% complete)`);
        } else {
          instruction = "continue";
          addToLog(`Generating chapter ${chunkCount + 1} (${(progressPercentage * 100).toFixed(1)}% complete)`);
        }

        const newChunk = await generateStoryChunk(instruction);
        
        if (!newChunk.trim()) {
          addToLog("Empty chunk received, stopping generation");
          break;
        }

        currentStory += (currentStory ? "\n\n" : "") + newChunk;
        chunkCount++;
        
        setStory(currentStory);
        updateProgress(currentStory);
        onStoryUpdate(currentStory);
        
        const newWordCount = currentStory.trim().split(/\s+/).filter(word => word.length > 0).length;
        addToLog(`Chapter ${chunkCount} completed (${newChunk.trim().split(/\s+/).length} words, total: ${newWordCount})`);
        
        setProgress(prev => ({ ...prev, chunksGenerated: chunkCount }));

        if (newWordCount >= targetWordCount || instruction === "final") {
          addToLog(`🎉 Story generation completed! Final word count: ${newWordCount}`);
          setProgress(prev => ({ ...prev, isComplete: true }));
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Story generation failed:", error);
      addToLog(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const stopGeneration = () => {
    setShouldStop(true);
    addToLog("Stopping generation after current chunk...");
  };

  const resetGeneration = () => {
    setStory("");
    setHasStarted(false);
    setIsGenerating(false);
    setShouldStop(false);
    setShowProgress(false);
    setGenerationLog([]);
    setProgress({
      currentWords: 0,
      targetWords: targetWordCount,
      chunksGenerated: 0,
      isComplete: false,
      percentage: 0
    });
    onStoryUpdate("");
  };

  useEffect(() => {
    setProgress(prev => ({ ...prev, targetWords: targetWordCount }));
  }, [targetWordCount]);

  return (
    <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl border-2 border-royal_blue_traditional-300 dark:border-mustard-700 backdrop-blur-sm flex flex-col h-[600px]">
      <div className="flex items-center justify-between p-6 border-b-2 border-royal_blue_traditional-300 dark:border-mustard-700">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg mr-3">
            <Timeline sx={{ fontSize: 20, color: '#11296b' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
              One-Shot Story Generation
            </h3>
            <p className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
              Progressive story building towards {targetWordCount.toLocaleString()} words
            </p>
          </div>
        </div>
        
        {hasStarted && (
          <div className="flex items-center space-x-2">
            <IconButton
              icon={<AutoFixHigh sx={{ fontSize: 16 }} />}
              onClick={() => setShowProgress(!showProgress)}
              title="Toggle progress details"
              variant="default"
            />
            <FunctionalButton
              onClick={resetGeneration}
              variant="outline"
              size="sm"
              disabled={isGenerating}
            >
              Reset
            </FunctionalButton>
          </div>
        )}
      </div>

      {showProgress && hasStarted && (
        <div className="p-4 border-b-2 border-royal_blue_traditional-300 dark:border-mustard-700 bg-mustard-50 dark:bg-mustard-900/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
              Progress: {progress.percentage.toFixed(1)}%
            </span>
            <span className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
              {progress.currentWords.toLocaleString()} / {progress.targetWords.toLocaleString()} words
            </span>
          </div>
          <div className="w-full bg-royal_blue_traditional-200 dark:bg-royal_blue_traditional-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-mustard-500 to-jonquil-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, progress.percentage)}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-500">
            <span>Chapters: {progress.chunksGenerated}</span>
            <span className={`flex items-center space-x-1 ${isGenerating ? 'text-mustard-600 dark:text-mustard-400' : progress.isComplete ? 'text-green-600 dark:text-green-400' : ''}`}>
              <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-mustard-500 animate-pulse' : progress.isComplete ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span>{isGenerating ? 'Generating...' : progress.isComplete ? 'Complete' : 'Ready'}</span>
            </span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        {!hasStarted ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-mustard-400 to-jonquil-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Timeline sx={{ fontSize: 28, color: '#11296b' }} />
            </div>
            <h4 className="text-xl font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
              Ready for One-Shot Generation?
            </h4>
            <p className="text-royal_blue_traditional-600 dark:text-anti_flash_white-400 mb-6 text-center max-w-md">
              This will progressively generate your complete story in chapters until reaching {targetWordCount.toLocaleString()} words
            </p>
            <div className="flex justify-center">
              <FunctionalButton
                onClick={startStoryGeneration}
                disabled={isGenerating}
                variant="primary"
                size="lg"
                icon={<PlayArrow sx={{ fontSize: 24 }} />}
              >
                Begin One-Shot Generation
              </FunctionalButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-royal_blue_traditional-700 rounded-lg p-4 border-2 border-royal_blue_traditional-300 dark:border-mustard-600">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-black">Generated Story</h4>
                <span className="text-sm text-royal_blue_traditional-600 dark:text-black bg-mustard-100 dark:bg-mustard-200 px-2 py-1 rounded">
                  {progress.currentWords.toLocaleString()} words
                </span>
              </div>
              
              {story ? (
                <div className="prose prose-sm max-w-none text-royal_blue_traditional-800 dark:text-black leading-relaxed whitespace-pre-wrap">
                  {story}
                </div>
              ) : (
                <div className="text-center py-8 text-royal_blue_traditional-600 dark:text-black italic">
                  {isGenerating ? "Story generation in progress..." : "Your story will appear here..."}
                </div>
              )}
              
              <div ref={storyRef} />
            </div>

            {generationLog.length > 0 && (
              <div className="bg-royal_blue_traditional-50 dark:bg-royal_blue_traditional-900/30 rounded-lg p-4 border-2 border-royal_blue_traditional-200 dark:border-mustard-600/50">
                <h4 className="text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">Generation Log</h4>
                <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-400 space-y-1 max-h-32 overflow-y-auto">
                  {generationLog.map((log, index) => (
                    <div key={index} className="font-mono">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hasStarted && (
        <div className="p-6 border-t-2 border-royal_blue_traditional-300 dark:border-mustard-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
              {isGenerating ? "Generation in progress..." : progress.isComplete ? "Story completed!" : "Generation paused"}
            </div>
            
            <div className="flex items-center space-x-2">
              {isGenerating ? (
                <IconButton
                  icon={<Stop sx={{ fontSize: 20 }} />}
                  onClick={stopGeneration}
                  title="Stop generation"
                  variant="danger"
                />
              ) : !progress.isComplete && (
                <FunctionalButton
                  onClick={startStoryGeneration}
                  variant="primary"
                  size="sm"
                  icon={<PlayArrow sx={{ fontSize: 16 }} />}
                >
                  Continue
                </FunctionalButton>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}