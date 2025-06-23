"use client";

import { useState } from 'react';
import { TrendingUp, AccessTime, Book, Speed } from '@mui/icons-material';
import FunctionalButton from '@/app/_components/Buttons/FunctionalButton';

interface WordCountSettingsProps {
  currentWordCount: number;
  onWordCountChange: (wordCount: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function WordCountSettings({
  currentWordCount,
  onWordCountChange,
  onConfirm,
  onCancel
}: WordCountSettingsProps) {
  const [localWordCount, setLocalWordCount] = useState(currentWordCount);

  const presetWordCounts = [
    { count: 500, label: "Flash", description: "Quick story" },
    { count: 1000, label: "Short", description: "Brief narrative" },
    { count: 2000, label: "Standard", description: "Short story" },
    { count: 3000, label: "Extended", description: "Long short story" },
    { count: 5000, label: "Novella", description: "Short novella" },
    { count: 8000, label: "Long", description: "Extended novella" },
    { count: 10000, label: "Epic", description: "Mini novel" }
  ];

  const getReadingTime = (words: number) => {
    const minutes = Math.round(words / 200);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getStoryCategory = (words: number) => {
    if (words < 1000) return { category: "Flash Fiction", color: "text-blue-600" };
    if (words < 2500) return { category: "Short Story", color: "text-green-600" };
    if (words < 7500) return { category: "Long Short Story", color: "text-yellow-600" };
    if (words < 17500) return { category: "Novelette", color: "text-orange-600" };
    if (words < 40000) return { category: "Novella", color: "text-red-600" };
    return { category: "Novel", color: "text-purple-600" };
  };

  const getGenerationTime = (words: number) => {
    const chunksNeeded = Math.ceil(words / 500); 
    const timePerChunk = 15;
    const totalSeconds = chunksNeeded * timePerChunk;
    
    if (totalSeconds < 60) return `~${totalSeconds}s`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return seconds > 0 ? `~${minutes}m ${seconds}s` : `~${minutes}m`;
  };

  const handlePresetSelect = (count: number) => {
    setLocalWordCount(count);
    onWordCountChange(count);
  };

  const handleCustomChange = (value: number) => {
    const clampedValue = Math.min(50000, Math.max(100, value));
    setLocalWordCount(clampedValue);
    onWordCountChange(clampedValue);
  };

  const storyInfo = getStoryCategory(localWordCount);

  return (
    <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl border-2 border-royal_blue_traditional-300 dark:border-mustard-700 backdrop-blur-sm p-6">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg mr-3">
          <TrendingUp sx={{ fontSize: 20, color: '#11296b' }} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
            Story Length Settings
          </h3>
          <p className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
            Configure your target word count for one-shot generation
          </p>
        </div>
      </div>

      <div className="bg-mustard-50 dark:bg-mustard-900/20 rounded-lg p-4 border-2 border-mustard-200 dark:border-mustard-600/30 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Book className="text-mustard-600 dark:text-mustard-400" sx={{ fontSize: 20 }} />
            <div>
              <div className="text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
                {localWordCount.toLocaleString()} words
              </div>
              <div className={`text-xs font-medium ${storyInfo.color}`}>
                {storyInfo.category}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AccessTime className="text-mustard-600 dark:text-mustard-400" sx={{ fontSize: 20 }} />
            <div>
              <div className="text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
                {getReadingTime(localWordCount)}
              </div>
              <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
                Reading time
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Speed className="text-mustard-600 dark:text-mustard-400" sx={{ fontSize: 20 }} />
            <div>
              <div className="text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
                {getGenerationTime(localWordCount)}
              </div>
              <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
                Est. generation
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-3">
          Quick Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presetWordCounts.map((preset) => (
            <button
              key={preset.count}
              onClick={() => handlePresetSelect(preset.count)}
              className={`p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 text-center ${
                localWordCount === preset.count
                  ? 'bg-gradient-to-r from-mustard-500 to-jonquil-500 text-royal_blue_traditional-800 border-mustard-500 shadow-lg'
                  : 'bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black border-royal_blue_traditional-300 dark:border-mustard-600 hover:border-mustard-400 dark:hover:border-mustard-400 hover:shadow-md'
              }`}
            >
              <div className="font-bold">{preset.count >= 1000 ? `${preset.count / 1000}k` : preset.count}</div>
              <div className="text-xs opacity-80">{preset.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
          Custom Word Count
        </label>
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min="100"
            max="50000"
            step="100"
            value={localWordCount}
            onChange={(e) => handleCustomChange(Number(e.target.value))}
            className="flex-1 h-2 bg-royal_blue_traditional-200 dark:bg-royal_blue_traditional-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <input
            type="number"
            value={localWordCount}
            onChange={(e) => handleCustomChange(Number(e.target.value))}
            className="w-24 p-2 border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black focus:border-mustard-500 dark:focus:border-mustard-400 focus:outline-none transition-colors duration-200 text-sm"
            min="100"
            max="50000"
            step="100"
          />
        </div>
        <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-500 mt-2">
          Range: 100 - 50,000 words • Recommended: 500 - 10,000 for best results
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-600/30 mb-6">
        <h4 className="text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
          📝 Generation Tips
        </h4>
        <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-400 space-y-1">
          <div><strong>500-1,000 words:</strong> Perfect for quick, focused stories with clear beginning and end</div>
          <div><strong>2,000-3,000 words:</strong> Ideal for character development and plot complexity</div>
          <div><strong>5,000+ words:</strong> Allows for rich world-building and multiple story arcs</div>
          <div><strong>10,000+ words:</strong> Suitable for complex narratives with detailed character arcs</div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-600/30 mb-6">
        <h4 className="text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
          🎯 How One-Shot Generation Works
        </h4>
        <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-400 space-y-1">
          <div>• Stories are generated in progressive chapters toward your target</div>
          <div>• Each chapter builds naturally on the previous content</div>
          <div>• The AI automatically manages pacing and story structure</div>
          <div>• Generation concludes naturally when approaching your word target</div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <FunctionalButton
          onClick={onConfirm}
          variant="primary"
          fullWidth
          icon={<TrendingUp sx={{ fontSize: 20 }} />}
        >
          Start Generation ({localWordCount.toLocaleString()} words)
        </FunctionalButton>
        <FunctionalButton
          onClick={onCancel}
          variant="outline"
        >
          Cancel
        </FunctionalButton>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #eab308);
          cursor: pointer;
          border: 2px solid #11296b;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #eab308);
          cursor: pointer;
          border: 2px solid #11296b;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-webkit-slider-track {
          height: 8px;
          background: linear-gradient(90deg, #f59e0b, #eab308);
          border-radius: 4px;
        }
        
        .slider::-moz-range-track {
          height: 8px;
          background: linear-gradient(90deg, #f59e0b, #eab308);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}