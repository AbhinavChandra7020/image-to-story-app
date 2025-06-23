
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
      
      // error check
      if (parsed.error) {
        throw new Error(parsed.error);
      }
      
      result += parsed.response ?? "";
    } catch (error) {
      if (error instanceof SyntaxError) {
        continue;
      }
      throw error;
    }
  }

  return result.trim();
}