import { oneShotStoryPrompt } from "./prompts";
import { parseStreamedResponse } from "./streamParser";
import { generatePolishedChunk } from "./generatePolishedChunk";
import { MODELS, OLLAMA_API_URL, GENERATION_PRESETS } from "../_utils/constants";
import type { OneShotStoryPrompts, CreativityLevel } from "../_types/promptTypes";

export async function generateOneShotStory({
  caption,
  genre = "General",
  storySoFar = "",
  chunkTarget = 800,
  instruction = "continue",
  focusMode = "balanced",
  creativityLevel = "balanced",
  consistencyMode = false,
}: OneShotStoryPrompts): Promise<string> {
  const prompt = oneShotStoryPrompt({
    caption,
    genre,
    storySoFar,
    chunkTarget,
    instruction,
    focusMode,
    creativityLevel,
    consistencyMode,
  });

  const preset = GENERATION_PRESETS.oneShot[creativityLevel as CreativityLevel] || GENERATION_PRESETS.oneShot.balanced;

  let { temperature, top_p, top_k, repeat_penalty } = preset;

  if (consistencyMode) {
    temperature *= 0.8;
    top_p *= 0.9;
    repeat_penalty += 0.05;
  }

  const num_ctx = 6144;
  const num_predict = chunkTarget + 200;

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
      stop: instruction === "final" ? ["THE END", "End of story", "---"] : [],
    },
  };

  const res = await fetch(`${OLLAMA_API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("One-shot story generation failed");

  const raw = await parseStreamedResponse(res.body!);
  const polished = await generatePolishedChunk(raw.trim(), creativityLevel);

  return polished;
}
