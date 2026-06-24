import { ValidationError } from '../../error'

export function validateOnboardingOutput(raw: unknown): {
  startHere: string[]
  keySignals: string[]
  gaps: string[]
} {
  if (typeof raw !== 'object' || raw === null) {
    throw new ValidationError('Invalid onboarding output', { raw })
  }

  const obj = raw as Record<string, unknown>

  if (!isStringArray(obj.startHere)) {
    throw new ValidationError('Invalid onboarding startHere output', { raw })
  }

  if (!isStringArray(obj.keySignals)) {
    throw new ValidationError('Invalid onboarding keySignals output', { raw })
  }

  if (!isStringArray(obj.gaps)) {
    throw new ValidationError('Invalid onboarding gaps output', { raw })
  }

  return {
    startHere: obj.startHere,
    keySignals: obj.keySignals,
    gaps: obj.gaps,
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}
