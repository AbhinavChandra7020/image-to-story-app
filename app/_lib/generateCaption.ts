import { imgCaptionPrompt } from "@/app/_lib/prompts";
import { OLLAMA_API_URL, MODELS } from "@/app/_utils/constants";

// generate a caption from the given image
export async function generateCaptionFromBase64(base64Image: string, detailLevel: "detailed" | "short" = "detailed") {
  const prompt = imgCaptionPrompt(detailLevel);

  const payload = {
    model: MODELS.caption,
    prompt,
    images: [base64Image],
    stream: false
  };

  const res = await fetch(`${OLLAMA_API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to generate caption");
  const json = await res.json();
  return json.response?.trim() ?? "";
}
