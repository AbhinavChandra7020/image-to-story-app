import { interactiveStoryPrompt } from "./prompts";
import { parseStreamedResponse } from "./streamParser";
import { generatePolishedChunk } from "./generatePolishedChunk";
import { MODELS, OLLAMA_API_URL, GENERATION_PRESETS } from "../_utils/constants";
import type { InteractiveStoryPrompts, CreativityLevel } from "../_types/promptTypes";

export async function generateInteractiveStory({
  caption,
  genre = "General",
  storySoFar = "",
  userInstruction = "",
  chunkTarget = 500,
  nearingEnd = false,
  ending = false,
  creativityLevel = "balanced",
  consistencyMode = false,
  focusMode = "balanced",
}: InteractiveStoryPrompts): Promise<string> {
  const prompt = interactiveStoryPrompt({
    caption,
    genre,
    storySoFar,
    userInstruction,
    chunkTarget,
    nearingEnd,
    ending,
    focusMode,
  });

  const preset = GENERATION_PRESETS.default[creativityLevel as CreativityLevel] || GENERATION_PRESETS.default.balanced;

  let { temperature, top_p, top_k, repeat_penalty } = preset;

  // Adjust for consistency mode
  if (consistencyMode && !ending) {
    temperature *= 0.8;
    top_p *= 0.9;
    repeat_penalty += 0.05;
  }

  const num_ctx = ending ? 8192 : storySoFar ? 6144 : 4096;
  const num_predict = ending ? 800 : storySoFar ? 600 : 700;

  const payload = {
    model: MODELS.story,
    prompt,
    stream: true,
    options: {
      temperature,
      top_p,
      top_k,
      repeat_penalty,
      num_ctx,
      num_predict,
      stop: ["THE END", "End of story", "---"],
      seed: creativityLevel === "creative" ? -1 : 42,
    },
  };

  const res = await fetch(`${OLLAMA_API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Story generation failed");

  const raw = await parseStreamedResponse(res.body!);
  const polished = await generatePolishedChunk(raw, creativityLevel);

  return polished;
}