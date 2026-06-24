import { ValidationError } from '../../error'
import { normalizeStringArray } from './normalizeOutput'

export function validateOnboardingOutput(raw: unknown): {
  startHere: string[]
  keySignals: string[]
  gaps: string[]
} {
  if (Array.isArray(raw)) {
    const startHere = normalizeStringArray(raw)
    if (!startHere) {
      throw new ValidationError('Invalid onboarding startHere output', { raw })
    }
    return {
      startHere,
      keySignals: [],
      gaps: [],
    }
  }

  if (typeof raw !== 'object' || raw === null) {
    throw new ValidationError('Invalid onboarding output', { raw })
  }

  const obj = raw as Record<string, unknown>
  const startHere = normalizeStringArray(obj.startHere)
  const keySignals = normalizeStringArray(obj.keySignals)
  const gaps = normalizeStringArray(obj.gaps)

  if (!startHere && !keySignals && !gaps) {
    throw new ValidationError('Invalid onboarding startHere output', { raw })
  }

  return {
    startHere: startHere ?? [],
    keySignals: keySignals ?? [],
    gaps: gaps ?? [],
  }
}
