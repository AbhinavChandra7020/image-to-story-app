
"use client";

import { useState } from 'react';
import { FileDownload, Title, Description, ContentCopy } from '@mui/icons-material';
import { saveAsTxt, saveAsDocx, saveAsPdf } from '@/app/_utils/saveFile';
import FunctionalButton from '@/app/_components/Buttons/FunctionalButton';
import IconButton from '@/app/_components/Buttons/IconButton';

interface StoryExportPanelProps {
  storyContent: string;
  storyTitle: string;
  onTitleChange: (title: string) => void;
  genre: string;
  originalCaption: string;
}

export default function StoryExportPanel({
  storyContent,
  storyTitle,
  onTitleChange,
  genre,
  originalCaption
}: StoryExportPanelProps) {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [titleOptions, setTitleOptions] = useState<string[]>([]);
  const [showTitleOptions, setShowTitleOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const wordCount = storyContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  const charCount = storyContent.length;

  const generateTitles = async () => {
    setIsGeneratingTitle(true);
    try {
      const response = await fetch("/api/title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyText: storyContent,
          genre,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to generate titles`);
      }
      
      const data = await response.json();
      
      if (data.titles && Array.isArray(data.titles)) {
        setTitleOptions(data.titles);
        setShowTitleOptions(true);
        if (data.titles.length > 0 && !storyTitle) {
          onTitleChange(data.titles[0]);
        }
      }
    } catch (error) {
      console.error("Title generation failed:", error);
      alert(`Failed to generate titles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleCopyStory = async () => {
    try {
      const finalTitle = storyTitle || `${genre} Story`;
      const fullContent = `${finalTitle}\n\n${storyContent}`;
      await navigator.clipboard.writeText(fullContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy story:', error);
    }
  };

  const handleExport = (format: 'txt' | 'docx' | 'pdf') => {
    const finalTitle = storyTitle || `${genre} Story`;
    const exportData = {
      title: finalTitle,
      storyText: storyContent
    };

    switch (format) {
      case 'txt':
        saveAsTxt(exportData);
        break;
      case 'docx':
        saveAsDocx(exportData);
        break;
      case 'pdf':
        saveAsPdf(exportData);
        break;
    }
  };

  return (
    <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl p-6 border-2 border-royal_blue_traditional-300 dark:border-mustard-700 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg mr-3">
          <FileDownload sx={{ fontSize: 20, color: '#11296b' }} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
            Export Story
          </h3>
          <p className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
            {wordCount} words • {charCount} characters
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
            Story Title
          </label>
          <FunctionalButton
            onClick={generateTitles}
            disabled={isGeneratingTitle}
            loading={isGeneratingTitle}
            variant="outline"
            size="sm"
            icon={<Title sx={{ fontSize: 14 }} />}
          >
            {isGeneratingTitle ? 'Generating...' : 'Generate'}
          </FunctionalButton>
        </div>

        <input
          type="text"
          value={storyTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full p-3 border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black focus:border-mustard-500 dark:focus:border-mustard-400 focus:outline-none transition-colors duration-200"
          placeholder="Enter a title for your story..."
        />

        {showTitleOptions && titleOptions.length > 0 && (
          <div className="mt-3 p-4 bg-mustard-50 dark:bg-mustard-900/20 rounded-lg border-2 border-mustard-200 dark:border-mustard-600/30">
            <h4 className="text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
              AI-Generated Title Suggestions:
            </h4>
            <div className="space-y-2">
              {titleOptions.map((title, index) => (
                <button
                  key={index}
                  onClick={() => onTitleChange(title)}
                  className="w-full text-left p-2 text-sm text-royal_blue_traditional-700 dark:text-anti_flash_white-300 hover:bg-mustard-100 dark:hover:bg-mustard-800/30 rounded transition-colors duration-200 cursor-pointer"
                >
                  {title}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowTitleOptions(false)}
              className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-500 mt-2 hover:text-mustard-600 dark:hover:text-mustard-400 transition-colors duration-200 cursor-pointer"
            >
              Hide suggestions
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
          Story Preview
        </label>
        <div className="relative">
          <textarea
            value={storyContent}
            readOnly
            className="w-full h-32 p-3 border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg bg-anti_flash_white-50 dark:bg-royal_blue_traditional-900/30 text-royal_blue_traditional-800 dark:text-anti_flash_white-200 text-sm resize-none focus:outline-none"
          />
          <div className="absolute top-2 right-2">
            <IconButton
              icon={<ContentCopy sx={{ fontSize: 16 }} />}
              onClick={handleCopyStory}
              title="Copy full story"
            />
          </div>
          {copied && (
            <div className="absolute top-2 right-12 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
              Copied!
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
          Export Options
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FunctionalButton
            onClick={() => handleExport('txt')}
            variant="secondary"
            icon={<FileDownload sx={{ fontSize: 18 }} />}
          >
            TXT
          </FunctionalButton>

          <FunctionalButton
            onClick={() => handleExport('docx')}
            variant="secondary"
            icon={<Description sx={{ fontSize: 18 }} />}
          >
            DOCX
          </FunctionalButton>

          <FunctionalButton
            onClick={() => handleExport('pdf')}
            variant="secondary"
            icon={<FileDownload sx={{ fontSize: 18 }} />}
          >
            PDF
          </FunctionalButton>
        </div>

        <FunctionalButton
          onClick={handleCopyStory}
          fullWidth
          variant="primary"
          icon={<ContentCopy sx={{ fontSize: 20 }} />}
        >
          Copy Complete Story
        </FunctionalButton>
      </div>

      <div className="mt-6 pt-4 border-t-2 border-royal_blue_traditional-300 dark:border-mustard-700">
        <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-500 space-y-1">
          <div><strong>Genre:</strong> {genre}</div>
          <div><strong>Generated from:</strong> {originalCaption.substring(0, 80)}...</div>
          <div><strong>Created:</strong> {new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
}