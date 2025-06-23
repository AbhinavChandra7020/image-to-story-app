"use client";

import { useState } from 'react';
import { Description, Edit, Check, Close, ContentCopy } from '@mui/icons-material';
import IconButton from '@/app/_components/Buttons/IconButton';

interface CaptionDisplaySectionProps {
  caption: string;
  onCaptionEdit: (newCaption: string) => void;
}

export default function CaptionDisplaySection({
  caption,
  onCaptionEdit
}: CaptionDisplaySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(caption);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onCaptionEdit(editedCaption);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCaption(caption);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy caption:', error);
    }
  };

  const truncatedCaption = caption.length > 150 ? caption.substring(0, 150) + "..." : caption;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end space-x-2">
        {!isEditing && (
          <>
            <IconButton
              icon={<ContentCopy sx={{ fontSize: 16 }} />}
              onClick={handleCopy}
              title="Copy caption"
            />
            <IconButton
              icon={<Edit sx={{ fontSize: 16 }} />}
              onClick={() => setIsEditing(true)}
              title="Edit caption"
            />
          </>
        )}
        
        {isEditing && (
          <>
            <IconButton
              icon={<Check sx={{ fontSize: 16 }} />}
              onClick={handleSave}
              title="Save changes"
              variant="success"
            />
            <IconButton
              icon={<Close sx={{ fontSize: 16 }} />}
              onClick={handleCancel}
              title="Cancel editing"
              variant="danger"
            />
          </>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={editedCaption}
          onChange={(e) => setEditedCaption(e.target.value)}
          className="w-full p-3 border-2 border-royal_blue_traditional-300 dark:border-mustard-500 rounded-lg bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black focus:border-mustard-500 dark:focus:border-mustard-400 focus:outline-none transition-colors duration-200 resize-none h-24 text-sm"
          placeholder="Edit the caption..."
          autoFocus
        />
      ) : (
        <div className="relative">
          <div 
            className="text-royal_blue_traditional-700 dark:text-anti_flash_white-300 leading-relaxed bg-anti_flash_white-50 dark:bg-royal_blue_traditional-900/30 p-3 rounded-lg border-2 border-royal_blue_traditional-200 dark:border-mustard-600/50 text-sm cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? caption : truncatedCaption}
            {caption.length > 150 && (
              <span className="text-mustard-600 dark:text-mustard-400 ml-2 font-medium">
                {isExpanded ? 'Show less' : 'Show more'}
              </span>
            )}
          </div>
          
          {copied && (
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
              Copied!
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-500">
        <span>{caption.length} characters</span>
        <span className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Ready</span>
        </span>
      </div>
    </div>
  );
}