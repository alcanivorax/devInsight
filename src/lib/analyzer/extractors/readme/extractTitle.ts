export function extractTitle(text: string): string | null {
  const match = text.match(/^#\s+(.+?)$/m);
  return match?.[1]?.trim() || null;
}
