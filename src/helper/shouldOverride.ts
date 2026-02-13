import type { ConfidenceLevel } from "@/lib/analyzer/extractors/types";

export function shouldOverride(
  existing: { confidence: ConfidenceLevel } | undefined,
  incoming: { confidence: ConfidenceLevel }
) {
  if (!existing) return true;
  if (existing.confidence === "explicit") return false;
  if (incoming.confidence === "explicit") return true;
  return false;
}
