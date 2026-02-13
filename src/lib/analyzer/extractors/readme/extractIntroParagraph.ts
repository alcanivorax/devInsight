export function extractIntroParagraph(text: string): string | null {
  const match = text.match(/^#\s+.+\n+([\s\S]*?)(?=\n#{2,6}\s|\Z)/m)

  if (!match) return null

  const block = match[1].trim()
  if (!block) return null

  const paragraphs = block
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)

  for (const paragraph of paragraphs) {
    // Skip badges / images
    if (/^(\[!\[|!\[)/.test(paragraph) && !/[a-zA-Z]{3,}/.test(paragraph)) {
      continue
    }

    // Skip lists
    if (/^[-*+]\s+/.test(paragraph)) {
      continue
    }

    // Skip code blocks
    if (/^```/.test(paragraph)) {
      continue
    }

    // Require actual prose
    const wordCount = paragraph.split(/\s+/).length
    if (wordCount < 6) continue

    return paragraph
  }

  return null
}
