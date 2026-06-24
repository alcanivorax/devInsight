import { ValidationError } from '../../error'
import { normalizeString, normalizeStringArray } from './normalizeOutput'

export function validateSetupOutput(raw: unknown): {
  installation: string | null
  runCommand?: string | null
  nextSteps?: string[]
} {
  const rawInstallation = normalizeString(raw)
  if (rawInstallation) {
    return {
      installation: rawInstallation,
      runCommand: undefined,
      nextSteps: undefined,
    }
  }

  if (typeof raw !== 'object' || raw === null) {
    throw new ValidationError('Invalid setup output', { raw })
  }

  const obj = raw as Record<string, unknown>

  if (
    obj.installation !== undefined &&
    obj.installation !== null &&
    !normalizeString(obj.installation)
  ) {
    throw new ValidationError('Invalid setup output', { raw })
  }

  if (
    obj.runCommand !== undefined &&
    obj.runCommand !== null &&
    !normalizeString(obj.runCommand)
  ) {
    throw new ValidationError('Invalid setup output', { raw })
  }

  return {
    installation: normalizeString(obj.installation),
    runCommand:
      obj.runCommand === undefined
        ? undefined
        : normalizeString(obj.runCommand),
    nextSteps: normalizeStringArray(obj.nextSteps),
  }
}
