
// types for prompts and other files related to it
export type FocusMode = "descriptive" | "dialogue" | "action" | "balanced";
export type CreativityLevel = "conservative" | "balanced" | "creative";
export type GenerationInstruction = "start" | "continue" | "conclusion" | "final";

export const FOCUS_MODES: FocusMode[] = ["descriptive", "dialogue", "action", "balanced"];
export const CREATIVITY_LEVELS: CreativityLevel[] = ["conservative", "balanced", "creative"];
export const GENERATION_INSTRUCTIONS: GenerationInstruction[] = ["start", "continue", "conclusion", "final"];

export interface OneShotStoryPrompts {
  caption: string;
  genre: string;
  storySoFar: string;
  chunkTarget: number;
  instruction: GenerationInstruction;
  focusMode?: FocusMode;
  creativityLevel: CreativityLevel;
  consistencyMode: boolean;
}

export interface InteractiveStoryPrompts {
  caption: string;
  genre?: string;
  storySoFar?: string;
  userInstruction?: string;
  chunkTarget?: number;
  nearingEnd?: boolean;
  ending?: boolean;
  creativityLevel?: CreativityLevel;
  consistencyMode?: boolean;
  focusMode?: FocusMode;
}

export interface TitleGenerationPrompts {
  storyText: string;
  genre?: string; 
}

// generate story page interface
export interface StoryMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  wordCount?: number;
}

export interface StorySettings {
  genre: string;
  creativityLevel: CreativityLevel;
  focusMode: FocusMode;
  consistencyMode: boolean;
  chunkTarget: number;
}

export interface CaptionGenerationRequest {
  image: File;
  detailLevel: "detailed" | "short";
}

export interface StoryGenerationState {
  isGenerating: boolean;
  hasStarted: boolean;
  totalWordCount: number;
  messagesCount: number;
  lastGenerated: Date | null;
}

// story export data interface
export interface StoryExportData {
  title: string;
  content: string;
  wordCount: number;
  genre: string;
  createdAt: Date;
  settings: StorySettings;
}

// story session interface
export interface StorySession {
  id: string;
  imageUrl?: string;
  caption: string;
  messages: StoryMessage[];
  settings: StorySettings;
  createdAt: Date;
  updatedAt: Date;
}

// generation progress for user guidance
export interface GenerationProgress {
  currentChapter: number;
  totalChapters?: number;
  wordsGenerated: number;
  targetWords?: number;
  estimatedTimeRemaining?: number;
}