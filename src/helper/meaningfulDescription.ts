export function isMeaningfulDescription(text: string): boolean {
  // Has at least one sentence-like structure
  if (!/[a-zA-Z]{3,}/.test(text)) return false

  // Too many badge markers relative to text
  const badgeCount = (text.match(/!\[.*?\]\(.*?\)/g) || []).length
  const wordCount = text.split(/\s+/).length

  if (badgeCount > 0 && wordCount < 20) return false

  return true
}
