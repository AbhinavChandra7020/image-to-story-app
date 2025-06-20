import { OneShotStoryPrompts } from "@/app/_types/promptTypes";
import { focusTextMap } from "@/app/_utils/constants";

/**
 * Constructs the prompt for one-shot story generation in progressive chunks.
 */
export function generateOneShotPrompt({
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

  // Base preamble for the model
  const base = `You are a master storyteller. Write a ${genre} story in captivating style.\n${focusText}`;

  // Customize tone/structure slightly based on instruction
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
