// app/_lib/prompts.ts

import {
  OneShotStoryPrompts,
  InteractiveStoryPrompts,
  TitleGenerationPrompts,
} from "@/app/_types/promptTypes";

import { focusTextMap } from "@/app/_utils/constants";

// image caption prompt
export function imgCaptionPrompt(detail: "short" | "detailed"): string {
  const detailedPrompt = `Describe the contents of this image in detail. Analyze the objects carefully and figure out who each character is. Pay attention to the surroundings and notice all the fine details. Only give the necessary information do not put any asterisks, just the details of the image.`;

  const shortPrompt = `Briefly describe the main subject of this image in 2-3 concise sentences. Focus on key objects or characters only.`;

  return detail === "detailed" ? detailedPrompt : shortPrompt;
}

// title generation prompt
export function titleGenerationPrompt({ storyText, genre }: TitleGenerationPrompts): string {
  return `You are a professional book title creator. Given the following ${genre} story, generate 5 creative, compelling, and short title options (max 10 words each). Avoid generic titles. Make them intriguing and genre-appropriate. Number each option clearly.

Story: ${storyText}
Title options:`;
}


// interactive story prompt
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

// one shot story generation prompt
export function oneShotStoryPrompt({
  caption,
  genre,
  storySoFar,
  instruction,
  chunkTarget,
  focusMode = "balanced",
  creativityLevel,
  consistencyMode,
}: OneShotStoryPrompts): string {
  const focusText = focusTextMap[focusMode];

  const base = `You are a master storyteller. Write a ${genre} story in captivating style.\n${focusText}`;

  switch (instruction) {
    case "start":
      return `${base}
Image Caption: "${caption}"

Begin the story. Aim for around ${chunkTarget} words.`;

    case "continue":
      return `${base}
Image Caption: "${caption}"

Story so far:
${storySoFar.slice(-3000)}

Continue the story. Aim for ${chunkTarget} words. Maintain consistency and style.`;

    case "conclusion":
      return `${base}
Image Caption: "${caption}"

Story so far:
${storySoFar.slice(-3000)}

Begin concluding the story. Make sure it wraps up narratively and emotionally in ${chunkTarget} words.`;

    case "final":
      return `${base}
Image Caption: "${caption}"

Story so far:
${storySoFar.slice(-3000)}

Finish the story. Ensure a satisfying and coherent ending within ${chunkTarget} words.`;

    default:
      throw new Error(`Invalid instruction: ${instruction}`);
  }
}

// chunk polish prompt
export function polishPrompt(chunk: string): string {
  return `You are a professional novel editor. Fix the grammar, enhance readability, and format the text into natural paragraphs. Preserve the original meaning and tone. Output ONLY the corrected story text WITHOUT any explanation, introduction, or notes. Just the pure and polished story.

Text:
${chunk}

Polished Story Text:`;
}

