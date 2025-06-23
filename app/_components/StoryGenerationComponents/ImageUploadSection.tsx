"use client";

import { useState, useRef } from 'react';
import { CloudUpload, Image as ImageIcon } from '@mui/icons-material';
import FunctionalButton from '@/app/_components/Buttons/FunctionalButton';

interface ImageUploadSectionProps {
  onImageUpload: (file: File, preview: string) => void;
  isGeneratingCaption: boolean;
  setIsGeneratingCaption: (loading: boolean) => void;
  onCaptionGenerated: (caption: string) => void;
  uploadedImage: File | null;
  imagePreview: string;
}

export default function ImageUploadSection({
  onImageUpload,
  isGeneratingCaption,
  setIsGeneratingCaption,
  onCaptionGenerated,
  uploadedImage,
  imagePreview
}: ImageUploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [detailLevel, setDetailLevel] = useState<"detailed" | "short">("detailed");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageUpload(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const generateCaption = async () => {
    if (!uploadedImage) return;

    setIsGeneratingCaption(true);
    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("detailLevel", detailLevel);

      const response = await fetch("/api/caption", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to generate caption");
      
      const data = await response.json();
      onCaptionGenerated(data.caption);
    } catch (error) {
      console.error("Caption generation failed:", error);
      alert("Failed to generate caption. Make sure your Ollama server is running.");
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  return (
    <div className="space-y-4">
      {imagePreview ? (
        <div className="relative group">
          <div className="relative w-full max-w-2xl mx-auto">
            <img
              src={imagePreview}
              alt="Uploaded preview"
              className="w-full max-h-96 object-contain rounded-xl border-2 border-royal_blue_traditional-300 dark:border-mustard-600 bg-white dark:bg-royal_blue_traditional-800"
              style={{ 
                minHeight: '200px',
                maxHeight: '400px'
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
              <FunctionalButton
                onClick={() => fileInputRef.current?.click()}
                variant="secondary"
                size="sm"
              >
                Change Image
              </FunctionalButton>
            </div>
          </div>
          
          <div className="mt-2 text-center">
            <p className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
              {uploadedImage?.name} • {uploadedImage && (uploadedImage.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer min-h-[200px] flex items-center justify-center ${
            dragActive
              ? 'border-mustard-500 bg-mustard-50 dark:border-mustard-400 dark:bg-mustard-900/20'
              : 'border-royal_blue_traditional-400 dark:border-mustard-400 hover:border-mustard-400 dark:hover:border-mustard-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-mustard-400 to-jonquil-500 rounded-full flex items-center justify-center mb-4">
              <CloudUpload sx={{ fontSize: 28, color: '#11296b' }} />
            </div>
            <h4 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
              Drop image here
            </h4>
            <p className="text-royal_blue_traditional-600 dark:text-anti_flash_white-400 text-sm mb-1">
              or click to browse
            </p>
            <p className="text-royal_blue_traditional-500 dark:text-anti_flash_white-500 text-xs">
              PNG, JPG, JPEG, WebP • Max 10MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {uploadedImage && (
        <div>
          <label className="block text-sm font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-2">
            Caption Detail Level
          </label>
          <select
            value={detailLevel}
            onChange={(e) => setDetailLevel(e.target.value as "detailed" | "short")}
            className="w-full p-3 text-sm border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black focus:border-mustard-500 dark:focus:border-mustard-400 focus:outline-none transition-colors duration-200"
          >
            <option value="detailed">Detailed Analysis</option>
            <option value="short">Quick Summary</option>
          </select>
        </div>
      )}

      {uploadedImage && (
        <FunctionalButton
          onClick={generateCaption}
          disabled={isGeneratingCaption}
          loading={isGeneratingCaption}
          fullWidth
          variant="primary"
        >
          {isGeneratingCaption ? 'Analyzing...' : 'Generate Caption'}
        </FunctionalButton>
      )}
    </div>
  );
}