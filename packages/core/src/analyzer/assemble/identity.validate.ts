import { ValidationError } from '../../error'
import { normalizeString } from './normalizeOutput'

export function validateIdentityOutput(raw: unknown): {
  summary: string
  purpose?: string | null
  audience?: string | null
} {
  const rawSummary = normalizeString(raw)
  if (rawSummary) {
    return {
      summary: rawSummary,
      purpose: null,
      audience: null,
    }
  }

  if (typeof raw !== 'object' || raw === null) {
    throw new ValidationError('Invalid identity output', { raw })
  }

  const obj = raw as Record<string, unknown>
  const summary = normalizeString(obj.summary)

  if (!summary) {
    throw new ValidationError('Invalid identity output', { raw })
  }

  return {
    summary,
    purpose: normalizeString(obj.purpose),
    audience: normalizeString(obj.audience),
  }
}
