"use client";

import { useState, useRef } from 'react';
import { Send, AutoFixHigh, Person, Timeline, Refresh } from '@mui/icons-material';
import type { StorySettings } from './StorySettingsPanel';
import FunctionalButton from '@/app/_components/Buttons/FunctionalButton';
import IconButton from '@/app/_components/Buttons/IconButton';
import StoryModeSelector, { StoryMode } from './StoryModeSelector';
import OneShotStoryGeneration from './OneShotStoryGeneration';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  wordCount?: number;
}

interface StoryGenerationChatProps {
  caption: string;
  settings: StorySettings;
  messages: Message[];
  onStoryUpdate: (messages: Message[], fullStory: string) => void;
}

export default function StoryGenerationChat({
  caption,
  settings,
  messages,
  onStoryUpdate
}: StoryGenerationChatProps) {
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [storyMode, setStoryMode] = useState<StoryMode | null>(null);
  const [targetWordCount, setTargetWordCount] = useState(2000);
  const [oneShotStory, setOneShotStory] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleModeSelect = (mode: StoryMode, wordCount?: number) => {
    setStoryMode(mode);
    setHasStarted(true);
    if (wordCount) {
      setTargetWordCount(wordCount);
    }
    
    if (mode === 'interactive') {
      generateInteractiveStory("", true);
    }
  };

  const handleWordCountChange = (wordCount: number) => {
    setTargetWordCount(wordCount);
  };

  const handleOneShotStoryUpdate = (story: string) => {
    setOneShotStory(story);
    if (story) {
      const aiMessage: Message = {
        id: 'oneshot-' + Date.now(),
        type: 'ai',
        content: story,
        timestamp: new Date(),
        wordCount: story.trim().split(/\s+/).filter(word => word.length > 0).length
      };
      onStoryUpdate([aiMessage], story);
    }
  };

  const generateInteractiveStory = async (userInstruction: string = "", isInitial: boolean = false) => {
    if (isGenerating) return;

    setIsGenerating(true);
    
    try {
      const currentStory = messages
        .filter(msg => msg.type === 'ai')
        .map(msg => msg.content)
        .join('\n\n');

      let newMessages = [...messages];
      if (userInstruction.trim()) {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: userInstruction,
          timestamp: new Date()
        };
        newMessages.push(userMessage);
      }

      const currentWordCount = currentStory.trim().split(/\s+/).filter(word => word.length > 0).length;
      const maxWords = 2000;
      const progressPercentage = currentWordCount / maxWords;
      
      let nearingEnd = false;
      let ending = false;
      
      if (progressPercentage >= 0.9) {
        ending = true;
      } else if (progressPercentage >= 0.75) {
        nearingEnd = true;
      }

      const response = await fetch("/api/story/interactive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption,
          genre: settings.genre,
          storySoFar: currentStory,
          userInstruction: userInstruction || (isInitial ? "Begin the story" : "Continue the story"),
          chunkTarget: settings.chunkTarget,
          nearingEnd,
          ending,
          creativityLevel: settings.creativityLevel,
          consistencyMode: settings.consistencyMode,
          focusMode: settings.focusMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to generate story`);
      }
      
      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.story,
        timestamp: new Date(),
        wordCount: data.story.trim().split(/\s+/).filter((word: string) => word.length > 0).length
      };
      
      newMessages.push(aiMessage);
      
      const fullStory = newMessages
        .filter(msg => msg.type === 'ai')
        .map(msg => msg.content)
        .join('\n\n');
      
      onStoryUpdate(newMessages, fullStory);
      
    } catch (error) {
      console.error("Story generation failed:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to generate story'}`,
        timestamp: new Date()
      };
      onStoryUpdate([...messages, errorMessage], '');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e?.preventDefault();
    if (userInput.trim() && !isGenerating && storyMode === 'interactive') {
      generateInteractiveStory(userInput.trim());
      setUserInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const switchMode = () => {
    setStoryMode(null);
  };

  const resetStory = () => {
    setHasStarted(false);
    setStoryMode(null);
    setOneShotStory("");
    onStoryUpdate([], "");
  };

  if (!hasStarted || !storyMode) {
    return (
      <StoryModeSelector
        onModeSelect={handleModeSelect}
        onWordCountChange={handleWordCountChange}
        currentWordCount={targetWordCount}
      />
    );
  }

  if (storyMode === 'oneshot') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-mustard-500 to-jonquil-500 rounded-lg">
              <Timeline sx={{ fontSize: 20, color: '#11296b' }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
                One-Shot Mode Active
              </h3>
              <p className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
                Target: {targetWordCount.toLocaleString()} words
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FunctionalButton
              onClick={switchMode}
              variant="outline"
              size="sm"
              icon={<Refresh sx={{ fontSize: 16 }} />}
            >
              Switch Mode
            </FunctionalButton>
            <FunctionalButton
              onClick={resetStory}
              variant="outline"
              size="sm"
            >
              Reset
            </FunctionalButton>
          </div>
        </div>

        <OneShotStoryGeneration
          caption={caption}
          settings={settings}
          onStoryUpdate={handleOneShotStoryUpdate}
          targetWordCount={targetWordCount}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <AutoFixHigh sx={{ fontSize: 20, color: 'white' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
              Interactive Mode Active
            </h3>
            <p className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
              Chat with AI to guide your story
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FunctionalButton
            onClick={resetStory}
            variant="outline"
            size="sm"
          >
            Reset
          </FunctionalButton>
        </div>
      </div>

      <div className="bg-anti_flash_white-100/80 dark:bg-royal_blue_traditional-800/50 rounded-2xl border-2 border-royal_blue_traditional-300 dark:border-mustard-700 backdrop-blur-sm flex flex-col h-[600px]">
        <div className="flex items-center p-6 border-b-2 border-royal_blue_traditional-300 dark:border-mustard-700">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3">
            <AutoFixHigh sx={{ fontSize: 20, color: 'white' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-royal_blue_traditional-800 dark:text-anti_flash_white-200">
              Interactive Story Chat
            </h3>
            <p className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
              Guide your story's direction through conversation
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-mustard-500 to-jonquil-500 text-royal_blue_traditional-800'
                    : message.type === 'ai'
                    ? 'bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black border-2 border-royal_blue_traditional-300 dark:border-mustard-600'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-2 border-red-300 dark:border-red-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-royal_blue_traditional-800/20' 
                      : message.type === 'ai'
                      ? 'bg-gradient-to-br from-mustard-400 to-jonquil-500'
                      : 'bg-red-500'
                  }`}>
                    {message.type === 'user' ? (
                      <Person sx={{ fontSize: 16, color: '#11296b' }} />
                    ) : message.type === 'ai' ? (
                      <AutoFixHigh sx={{ fontSize: 16, color: '#11296b' }} />
                    ) : (
                      <div className="w-4 h-4 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.wordCount && (
                        <span>{message.wordCount} words</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-2xl p-4 max-w-[80%]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-mustard-400 to-jonquil-500 rounded-lg">
                    <AutoFixHigh sx={{ fontSize: 16, color: '#11296b' }} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-mustard-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-mustard-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-mustard-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">AI is crafting your story...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t-2 border-royal_blue_traditional-300 dark:border-mustard-700">
          {!isGenerating && (
            <>
              <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={userInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Guide the story direction..."
                    className="w-full p-3 border-2 border-royal_blue_traditional-300 dark:border-mustard-600 rounded-lg bg-white dark:bg-royal_blue_traditional-700 text-royal_blue_traditional-800 dark:text-black focus:border-mustard-500 dark:focus:border-mustard-400 focus:outline-none transition-colors duration-200 resize-none overflow-hidden"
                    rows={1}
                    style={{ minHeight: '48px' }}
                  />
                </div>
                <IconButton
                  icon={<Send sx={{ fontSize: 20 }} />}
                  onClick={handleSubmit}
                  disabled={!userInput.trim()}
                  variant="default"
                  type="submit"
                />
              </form>
              <div className="text-xs text-royal_blue_traditional-600 dark:text-anti_flash_white-500 mt-2">
                Press Enter to send, Shift+Enter for new line
              </div>
            </>
          )}
          {isGenerating && (
            <div className="text-center py-4">
              <div className="text-sm text-royal_blue_traditional-600 dark:text-anti_flash_white-400">
                AI is generating your story...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}