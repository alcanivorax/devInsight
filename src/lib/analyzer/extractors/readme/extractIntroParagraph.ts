export function extractIntroParagraph(text: string): string | null {
  const match = text.match(/^#\s+.+\n+([\s\S]*?)(?=\n##\s|\Z)/m);

  if (!match) return null;

  const paragraph = match[1]
    .trim()
    .split("\n\n")[0] // first paragraph only
    .trim();

  return paragraph || null;
}
