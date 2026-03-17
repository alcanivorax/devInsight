export function extractSection(
  text: string,
  headings: string[]
): string | null {
  const headingPattern = headings
    .map((h) =>
      h
        .toLowerCase()
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\s+/g, '\\s+')
    )
    .join('|')

  const regex = new RegExp(
    `^#{1,6}\\s*(?:${headingPattern})\\b[^\\n]*\\n([\\s\\S]*?)(?=^#{1,6}\\s|\\Z)`,
    'gim'
  )

  const match = regex.exec(text)
  if (!match) return null

  const section = match[1].trim()
  return section.replace(/\n{3,}/g, '\n\n')
}
