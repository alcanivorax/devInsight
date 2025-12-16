export function detectEntryPoint(
  path: string,
  language: string,
  entryPoints: Map<string, string[]>
): string | null {
  const candidates = entryPoints.get(language) || [];
  const normalized = path.toLowerCase();

  for (const candidate of candidates) {
    if (
      normalized.endsWith(candidate.toLowerCase()) ||
      normalized === candidate.toLowerCase()
    ) {
      return path;
    }
  }

  return null;
}
