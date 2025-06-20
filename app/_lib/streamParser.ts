// app/_lib/streamParser.ts

export async function parseStreamedResponse(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    try {
      const chunk = decoder.decode(value, { stream: true });
      const parsed = JSON.parse(chunk.trim());
      result += parsed.response ?? "";
    } catch {
      // ignore malformed chunks (e.g., incomplete JSON between stream splits)
      continue;
    }
  }

  return result.trim();
}
