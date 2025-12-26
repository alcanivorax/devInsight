import { EntryPointValue } from "../types";

export function detectEntryPoint(
  path: string,
  entryPatterns: RegExp[]
): EntryPointValue | null {
  const normalized = path.toLowerCase();

  for (const pattern of entryPatterns) {
    if (pattern.test(normalized)) {
      return {
        value: path,
        confidence: "inferred",
      };
    }
  }

  return null;
}
