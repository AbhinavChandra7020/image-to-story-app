import { POLISH_PRESETS, OLLAMA_API_URL, MODELS } from "@/app/_utils/constants";
import { polishPrompt } from "@/app/_lib/prompts";
import type { CreativityLevel } from "@/app/_types/promptTypes";

export async function generatePolishedChunk(chunk: string, creativityLevel: CreativityLevel = "balanced") {
  const params = POLISH_PRESETS[creativityLevel];

  const payload = {
    model: MODELS.polish,
    prompt: polishPrompt(chunk),
    stream: false,
    options: {
      temperature: params.temperature,
      top_p: params.top_p,
      repeat_penalty: params.repeat_penalty,
      num_ctx: 4096,
      num_predict: 1000,
    },
  };

  const res = await fetch(`${OLLAMA_API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to polish story chunk");
  const data = await res.json();
  return data.response?.trim() ?? "";
}
