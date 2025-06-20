// types/promptTypes.ts

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