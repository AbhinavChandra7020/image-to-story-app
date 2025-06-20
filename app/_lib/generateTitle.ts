import { OLLAMA_API_URL, MODELS } from "@/app/_utils/constants";
import { titleGenerationPrompt } from "@/app/_lib/prompts";
import { TitleGenerationPrompts } from "@/app/_types/promptTypes"

export async function generateTitle({
  storyText,
  genre = "General",
}: TitleGenerationPrompts): Promise<string[]> {
  const model = MODELS.title;

  const prompt = titleGenerationPrompt({storyText, genre});

  const payload = {
    model,
    prompt,
    stream: false,
  };

  const res = await fetch(`${OLLAMA_API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to generate title");

  const { response } = await res.json();

  return response
    .split("\n")
    .filter((line: string) => /^\d+\.\s+/.test(line))
    .map((line: string) =>
      line.replace(/^\d+\.\s*/, "").replace(/^[\"“”]+|[\"“”]+$/g, "")
    );
}
