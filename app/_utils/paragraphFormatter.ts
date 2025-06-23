
export function normalizeParagraphs(text: string): string {
  return text
    .split(/\n{2,}/) // split paragraphs (double newlines)
    .map(para => para.replace(/\n/g, ' ').trim()) // remove internal newlines
    .filter(Boolean)
    .join('\n\n'); // rejoin with proper paragraph spacing
}
