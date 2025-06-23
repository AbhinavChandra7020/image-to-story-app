
"use client";

import { useState } from 'react';
import { Tune, ExpandMore, ExpandLess } from '@mui/icons-material';
import type { CreativityLevel, FocusMode } from '@/app/_types/promptTypes';
import IconButton from '@/app/_components/Buttons/IconButton';

export interface StorySettings {
  genre: string;
  creativityLevel: CreativityLevel;
  focusMode: FocusMode;
  consistencyMode: boolean;
  chunkTarget: number;
}

interface StorySettingsPanelProps {
  settings: StorySettings;
  onSettingsChange: (settings: StorySettings) => void;
  disabled: boolean;
}

const GENRES = [
  "General", "Fantasy", "Science Fiction", "Mystery", "Romance", "Horror", 
  "Adventure", "Drama", "Comedy", "Thriller", "Historical Fiction", "Western"
];

const CREATIVITY_LEVELS: CreativityLevel[] = ["conservative", "balanced", "creative"];
const FOCUS_MODES: FocusMode[] = ["descriptive", "dialogue", "action", "balanced"];

export default function StorySettingsPanel({
  settings,
  onSettingsChange,
  disabled
}: StorySettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [filteredGenres, setFilteredGenres] = useState(GENRES);

  const updateSetting = <K extends keyof StorySettings>(key: K, value: StorySettings[K]) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleGenreChange = (value: string) => {
    updateSetting('genre', value);
    const filtered = GENRES.filter(g => 
      g.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredGenres(filtered);
  };

  const selectGenre = (selectedGenre: string) => {
    updateSetting('genre', selectedGenre);
    setShowGenreDropdown(false);
    setFilteredGenres(GENRES);
  };

  return (
    <div className={`bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl border-2 border-royal_blue_traditional-300 dark:border-mustard-700 backdrop-blur-sm transition-all duration-300 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg mr-3">
            <Tune sx={{ fontSize: 20, color: '#11296b' }} />
          </div>
          <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
            Story Settings
          </h3>
        </div>
        <IconButton
          icon={isExpanded ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>

      {!isExpanded && (
        <div className="px-6 pb-6">
          <div className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
            <span className="text-royal_blue_traditional-500 dark:text-anti_flash_white-500">Genre:</span>{" "}
            <span className="font-medium">{settings.genre}</span> • 
            <span className="text-royal_blue_traditional-500 dark:text-anti_flash_white-500 ml-1">Creativity:</span>{" "}
            <span className="font-medium capitalize">{settings.creativityLevel}</span> • 
            <span className="text-royal_blue_traditional-500 dark:text-anti_flash_white-500 ml-1">Focus:</span>{" "}
            <span className="font-medium capitalize">{settings.focusMode}</span>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 animate-shimmer-light">
          <div>
            <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
              Genre
            </label>
            <div className="relative">
              <input
                type="text"
                value={settings.genre}
                onChange={(e) => handleGenreChange(e.target.value)}
                onFocus={() => setShowGenreDropdown(true)}
                onBlur={() => setTimeout(() => setShowGenreDropdown(false), 150)}
                className="w-full p-3 border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black focus:border-mustard-500 dark:focus:border-mustard-400 focus:outline-none transition-colors duration-200"
                placeholder="Enter custom genre or select from dropdown"
              />
              
              {showGenreDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-royal_blue_traditional-700 border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredGenres.length > 0 ? (
                    filteredGenres.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => selectGenre(g)}
                        className="w-full text-left px-3 py-2 hover:bg-mustard-50 dark:hover:bg-mustard-900/20 text-royal_blue_traditional-800 dark:text-black border-b border-anti_flash_white-200 dark:border-royal_blue_traditional-600 last:border-b-0 cursor-pointer"
                      >
                        {g}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-royal_blue_traditional-500 dark:text-black italic">
                      No matching genres - type your custom genre
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
                Creativity Level
              </label>
              <select
                value={settings.creativityLevel}
                onChange={(e) => updateSetting('creativityLevel', e.target.value as CreativityLevel)}
                className="w-full p-3 border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black focus:border-mustard-500 dark:focus:border-mustard-400 focus:outline-none transition-colors duration-200"
              >
                {CREATIVITY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
                Focus Mode
              </label>
              <select
                value={settings.focusMode}
                onChange={(e) => updateSetting('focusMode', e.target.value as FocusMode)}
                className="w-full p-3 border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black focus:border-mustard-500 dark:focus:border-mustard-400 focus:outline-none transition-colors duration-200"
              >
                {FOCUS_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
              Chunk Target (words)
            </label>
            <input
              type="number"
              value={settings.chunkTarget}
              onChange={(e) => updateSetting('chunkTarget', Number(e.target.value))}
              className="w-full p-3 border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black focus:border-mustard-500 dark:focus:border-mustard-400 focus:outline-none transition-colors duration-200"
              min="100"
              max="1500"
              step="50"
            />
            <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-500 mt-1">
              Controls how long each story response will be (100-1500 words)
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="consistencyMode"
              checked={settings.consistencyMode}
              onChange={(e) => updateSetting('consistencyMode', e.target.checked)}
              className="w-4 h-4 text-mustard-600 bg-white dark:bg-royal_blue_traditional-700 border-royal_blue_traditional-300 dark:border-mustard-600 rounded focus:ring-mustard-500 dark:focus:ring-mustard-400 focus:ring-2 cursor-pointer"
            />
            <label htmlFor="consistencyMode" className="ml-3 text-sm font-medium text-royal_blue_traditional-800 dark:text-anti_flash_white-200 cursor-pointer">
              Consistency Mode
            </label>
          </div>
          <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-500 ml-7 -mt-2">
            Reduces randomness for more coherent narratives
          </div>
        </div>
      )}
    </div>
  );
}