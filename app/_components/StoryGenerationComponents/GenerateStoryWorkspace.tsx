"use client";

import { useState } from 'react';
import ImageUploadSection from './ImageUploadSection';
import CaptionDisplaySection from './CaptionDisplaySection';
import StorySettingsPanel from './StorySettingsPanel';
import StoryGenerationChat from './StoryGenerationChat';
import StoryExportPanel from './StoryExportPanel';
import type { StorySettings, StoryMessage } from '@/app/_types/promptTypes';

export default function GenerateStoryWorkspace() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [captionGenerated, setCaptionGenerated] = useState(false);
  
  const [storySettings, setStorySettings] = useState<StorySettings>({
    genre: "General",
    creativityLevel: "balanced",
    focusMode: "balanced",
    consistencyMode: false,
    chunkTarget: 500,
  });

  const [storyMessages, setStoryMessages] = useState<StoryMessage[]>([]);
  const [completeStory, setCompleteStory] = useState("");
  const [storyTitle, setStoryTitle] = useState("");

  const handleImageUpload = (file: File, preview: string) => {
    setUploadedImage(file);
    setImagePreview(preview);
    setCaptionGenerated(false);
    setCaption("");
    setStoryMessages([]);
    setCompleteStory("");
    setStoryTitle("");
  };

  const handleCaptionGenerated = (generatedCaption: string) => {
    setCaption(generatedCaption);
    setCaptionGenerated(true);
  };

  const handleStoryUpdate = (newMessages: StoryMessage[], fullStory: string) => {
    setStoryMessages(newMessages);
    setCompleteStory(fullStory);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-anti_flash_white-100 via-anti_flash_white-200 to-mustard-100/20 dark:from-royal_blue_traditional-900 dark:via-royal_blue_traditional-800 dark:to-polynesian_blue-900/30 pt-16">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
          
          <div className="lg:col-span-3 space-y-4">
            {captionGenerated && (
              <StorySettingsPanel
                settings={storySettings}
                onSettingsChange={setStorySettings}
                disabled={false}
              />
            )}

            {captionGenerated ? (
              <StoryGenerationChat
                caption={caption}
                settings={storySettings}
                messages={storyMessages}
                onStoryUpdate={handleStoryUpdate}
              />
            ) : (
              <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl p-8 border-2 border-royal_blue_traditional-300 dark:border-mustard-700 text-center min-h-[400px] flex items-center justify-center">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-mustard-400 to-jonquil-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                    <svg className="w-8 h-8 text-royal_blue_traditional-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200 mb-3">
                    Ready to Begin Your Story?
                  </h3>
                  <p className="text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
                    Upload an image on the right and generate a caption to start your storytelling journey.
                  </p>
                </div>
              </div>
            )}

            {completeStory && (
              <StoryExportPanel
                storyContent={completeStory}
                storyTitle={storyTitle}
                onTitleChange={setStoryTitle}
                genre={storySettings.genre}
                originalCaption={caption}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 space-y-4">
              <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl p-6 border-2 border-royal_blue_traditional-300 dark:border-mustard-700 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-royal_blue_traditional-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
                    Upload & Show Image
                  </h3>
                </div>

                <ImageUploadSection
                  onImageUpload={handleImageUpload}
                  isGeneratingCaption={isGeneratingCaption}
                  setIsGeneratingCaption={setIsGeneratingCaption}
                  onCaptionGenerated={handleCaptionGenerated}
                  uploadedImage={uploadedImage}
                  imagePreview={imagePreview}
                />
              </div>

              {caption && (
                <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl p-6 border-2 border-royal_blue_traditional-300 dark:border-mustard-700 backdrop-blur-sm">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-royal_blue_traditional-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
                      Image Caption & Details
                    </h3>
                  </div>

                  <CaptionDisplaySection
                    caption={caption}
                    onCaptionEdit={setCaption}
                  />
                </div>
              )}

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${
                    captionGenerated ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
                    {captionGenerated ? 'Ready for story generation' : 'Waiting for image upload'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}