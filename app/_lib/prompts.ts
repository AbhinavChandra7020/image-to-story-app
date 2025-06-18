// app/_lib/prompts.ts

import {
  OneShotStoryPrompts,
  InteractiveStoryPrompts,
  FocusMode
} from "@/app/_types/promptTypes";

// === Prompt for Image Caption Generation ===
export function imgCaptionPrompt(detail: "short" | "detailed"): string {
  const detailedPrompt = `Describe the contents of this image in detail. Analyze the objects carefully and figure out who each character is. Pay attention to the surroundings and notice all the fine details.`;

  const shortPrompt = `Briefly describe the main subject of this image in 2-3 concise sentences. Focus on key objects or characters only.`;

  return detail === "detailed" ? detailedPrompt : shortPrompt;
}

// === Prompt for Title Generation ===
export function titleGenerationPrompt(storyText: string, genre: string = "General"): string {
  return `You are a professional book title creator. Given the following ${genre} story, generate 5 creative, compelling, and short title options (max 10 words each). Avoid generic titles. Make them intriguing and genre-appropriate. Number each option clearly.

Story: ${storyText}
Title options:`;
}

// === Focus Mode Prompt Modifiers ===
const focusTextMap: Record<FocusMode, string> = {
  descriptive: "Focus on vivid descriptions and sensory details.",
  dialogue: "Emphasize character interactions and dialogue.",
  action: "Focus on dynamic scenes and plot progression.",
  balanced: "Balance description, dialogue, and action.",
};

// === One-Shot Story Prompt ===
export function oneShotStoryPrompt({
  caption,
  genre,
  storySoFar,
  chunkTarget = 500,
  instruction,
  focusMode = "balanced",
}: OneShotStoryPrompts): string {
  const focusText = focusTextMap[focusMode];

  switch (instruction) {
    case "conclusion":
      return `You are a critically acclaimed novelist. Begin concluding the story gracefully based on the content written so far. Write approximately ${chunkTarget} words.
${focusText}
Description: "${caption}"
Story so far: ${storySoFar.slice(-4000)}
Continue the story towards its conclusion:`;

    case "final":
      return `You are a critically acclaimed novelist. Write the final ${chunkTarget} words to complete this story. Provide a satisfying, coherent ending.
${focusText}
Description: "${caption}"
Story so far: ${storySoFar.slice(-4000)}
Write the ending:`;

    case "start":
      return `You are a critically acclaimed novelist. Write the beginning of a ${genre} story based on its description. Write approximately ${chunkTarget} words.
${focusText}
Description: "${caption}"
Begin the story:`;

    case "continue":
    default:
      return `You are a critically acclaimed novelist. Continue this ${genre} story by developing the plot further. Write approximately ${chunkTarget} words.
${focusText}
Description: "${caption}"
Story so far: ${storySoFar.slice(-4000)}
Continue the story:`;
  }
}

// === Interactive Story Prompt ===
export function interactiveStoryPrompt({
  caption,
  genre = "General",
  storySoFar = "",
  userInstruction = "",
  chunkTarget = 500,
  nearingEnd = false,
  ending = false,
  focusMode = "balanced",
}: InteractiveStoryPrompts): string {
  const focusText = focusTextMap[focusMode];

  let instruction = "";
  if (ending) instruction = "final";
  else if (nearingEnd) instruction = "conclusion";
  else if (!storySoFar || storySoFar.trim() === "") instruction = "start";
  else instruction = "continue";

  switch (instruction) {
    case "conclusion":
      return `You are a critically acclaimed novelist. Begin concluding the story gracefully based on the content written so far. Write approximately ${chunkTarget} words.
${focusText}
Description: "${caption}"
Story so far: ${storySoFar.slice(-3000)}
Continue the story towards its conclusion:`;

    case "final":
      return `You are a critically acclaimed novelist. Write the final ${chunkTarget} words to complete this story. Provide a satisfying and coherent ending.
${focusText}
Description: "${caption}"
Story so far: ${storySoFar.slice(-3000)}
Write the ending:`;

    case "start":
      return `You are a critically acclaimed novelist. Write the beginning of a ${genre} story based on its description. Write approximately ${chunkTarget} words.
${focusText}
Description: "${caption}"
Begin the story:`;

    case "continue":
    default:
      return `You are a critically acclaimed novelist. Continue this ${genre} story by developing the plot further. Write approximately ${chunkTarget} words.
${focusText}
Description: "${caption}"
User instruction: ${userInstruction || "Continue the story naturally."}
Story so far: ${storySoFar.slice(-3000)}
Continue the story:`;
  }
}

export function polishPrompt(chunk:string): string {

  return `You are a professional novel editor. Fix the grammar, enhance readability, and format the text into natural paragraphs. Preserve the roiginal meaning and tone. Output ONLY the corrected story text WITHOUT any explanation, introduction, or notes. Just the pure and polished story.
  Text${chunk}
  Polished Story Text:`
}
