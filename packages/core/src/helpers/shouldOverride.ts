import type { ConfidenceLevel } from '../analyzer/extractors/types'

export function shouldOverride(
  existing: { confidence: ConfidenceLevel } | undefined,
  incoming: { confidence: ConfidenceLevel }
): boolean {
  if (!existing) return true
  if (existing.confidence === 'explicit') return false
  if (incoming.confidence === 'explicit') return true
  return false
}
