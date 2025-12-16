export function extractSection(
  text: string,
  headings: string[]
): string | null {
  const headingPattern = headings
    .map(h => h.toLowerCase())
    .join("|")
    .replace(/\s+/g, "\\s+");

  const regex = new RegExp(
    `^##{1,3}\\s*(?:${headingPattern})\\b[^\n]*\\n([\\s\\S]*?)(?=^##{1,3}\\s|\\Z)`,
    "gim"
  );

  const match = regex.exec(text);
  if (!match) return null;

  const section = match[0].trim();
  return section.replace(/\n{3,}/g, "\n\n");
}

