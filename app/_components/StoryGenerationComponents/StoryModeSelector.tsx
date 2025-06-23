"use client";

import { useState } from 'react';
import { Chat, Timeline, AutoFixHigh, Settings } from '@mui/icons-material';
import FunctionalButton from '@/app/_components/Buttons/FunctionalButton';

export type StoryMode = 'interactive' | 'oneshot';

interface StoryModeSelectorProps {
  onModeSelect: (mode: StoryMode, targetWordCount?: number) => void;
  onWordCountChange: (wordCount: number) => void;
  currentWordCount: number;
}

export default function StoryModeSelector({ 
  onModeSelect, 
  onWordCountChange, 
  currentWordCount 
}: StoryModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<StoryMode | null>(null);
  const [localWordCount, setLocalWordCount] = useState(currentWordCount);
  const [showWordCountSettings, setShowWordCountSettings] = useState(false);

  const handleModeSelect = (mode: StoryMode) => {
    setSelectedMode(mode);
    if (mode === 'oneshot') {
      setShowWordCountSettings(true);
    } else {
      onModeSelect(mode);
    }
  };

  const handleWordCountConfirm = () => {
    onWordCountChange(localWordCount);
    onModeSelect('oneshot', localWordCount);
    setShowWordCountSettings(false);
  };

  const handleWordCountCancel = () => {
    setSelectedMode(null);
    setShowWordCountSettings(false);
    setLocalWordCount(currentWordCount);
  };

  const presetWordCounts = [500, 1000, 2000, 3000, 5000, 8000, 10000];

  if (showWordCountSettings) {
    return (
      <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl border-2 border-royal_blue_traditional-300 dark:border-mustard-700 backdrop-blur-sm">
        <div className="flex items-center p-6 border-b-2 border-royal_blue_traditional-300 dark:border-mustard-700">
          <div className="p-2 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg mr-3">
            <Settings sx={{ fontSize: 20, color: '#11296b' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
              One-Shot Story Settings
            </h3>
            <p className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
              Set your target word count for the complete story
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-3">
              Quick Presets
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {presetWordCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => setLocalWordCount(count)}
                  className={`p-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                    localWordCount === count
                      ? 'bg-gradient-to-r from-mustard-500 to-jonquil-500 text-royal_blue_traditional-800 border-mustard-500'
                      : 'bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black border-royal_blue_traditional-300 dark:border-mustard-600 hover:border-mustard-400 dark:hover:border-mustard-400'
                  }`}
                >
                  {count >= 1000 ? `${count / 1000}k` : count}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
              Custom Word Count
            </label>
            <input
              type="number"
              value={localWordCount}
              onChange={(e) => setLocalWordCount(Number(e.target.value))}
              className="w-full p-3 border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black focus:border-mustard-500 dark:focus:border-mustard-400 focus:outline-none transition-colors duration-200"
              min="100"
              max="50000"
              step="100"
            />
            <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-500 mt-1">
              Range: 100 - 50,000 words • Estimated reading time: ~{Math.round(localWordCount / 200)} minutes
            </div>
          </div>
          <div className="bg-mustard-50 dark:bg-mustard-900/20 rounded-lg p-4 border-2 border-mustard-200 dark:border-mustard-600/30">
            <h4 className="text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
              📖 Story Length Guide
            </h4>
            <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-400 space-y-1">
              <div><strong>500-1,000 words:</strong> Flash fiction / Short scene</div>
              <div><strong>2,000-3,000 words:</strong> Short story</div>
              <div><strong>5,000-8,000 words:</strong> Long short story</div>
              <div><strong>10,000+ words:</strong> Novelette / Short novella</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <FunctionalButton
              onClick={handleWordCountConfirm}
              variant="primary"
              fullWidth
              icon={<Timeline sx={{ fontSize: 20 }} />}
            >
              Start One-Shot Generation ({localWordCount.toLocaleString()} words)
            </FunctionalButton>
            <FunctionalButton
              onClick={handleWordCountCancel}
              variant="outline"
            >
              Cancel
            </FunctionalButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl border-2 border-royal_blue_traditional-300 dark:border-mustard-700 backdrop-blur-sm">
      <div className="flex items-center p-6 border-b-2 border-royal_blue_traditional-300 dark:border-mustard-700">
        <div className="p-2 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg mr-3">
          <AutoFixHigh sx={{ fontSize: 20, color: '#11296b' }} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
            Choose Story Generation Mode
          </h3>
          <p className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
            Select how you'd like to create your story
          </p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="group cursor-pointer" onClick={() => handleModeSelect('interactive')}>
          <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-700/80 rounded-xl p-6 border-2 border-white dark:border-white hover:border-mustard-500 dark:hover:border-mustard-400 transition-all duration-200 hover:shadow-lg hover:shadow-mustard-500/20">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg">
                <Chat sx={{ fontSize: 24, color: '#11296b' }} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-white mb-2">
                  Interactive Mode
                </h4>
                <p className="text-sm text-royal_blue_traditional-600 dark:text-white mb-3">
                  Chat with the AI to guide your story development. Perfect for collaborative storytelling where you can influence the direction as it unfolds.
                </p>
                <div className="flex items-center space-x-4 text-xs text-royal_blue_traditional-500 dark:text-white">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Real-time guidance</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Flexible length</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Creative control</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group cursor-pointer" onClick={() => handleModeSelect('oneshot')}>
          <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-700/80 rounded-xl p-6 border-2 border-white dark:border-white hover:border-mustard-500 dark:hover:border-mustard-400 transition-all duration-200 hover:shadow-lg hover:shadow-mustard-500/20">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg">
                <Timeline sx={{ fontSize: 24, color: '#11296b' }} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-white mb-2">
                  One-Shot Mode
                </h4>
                <p className="text-sm text-royal_blue_traditional-600 dark:text-white mb-3">
                  Set a target word count and let the AI progressively build your complete story automatically. Great for structured, cohesive narratives.
                </p>
                <div className="flex items-center space-x-4 text-xs text-royal_blue_traditional-500 dark:text-white">
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Auto-progression</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Target length</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Cohesive flow</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-500 mt-4">
          Both modes use your uploaded image and caption as the foundation for story generation
        </div>
      </div>
    </div>
  );
}