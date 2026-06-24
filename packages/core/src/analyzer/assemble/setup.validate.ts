import { ValidationError } from '../../error'

export function validateSetupOutput(raw: unknown): {
  installation: string | null
  runCommand?: string | null
  nextSteps?: string[]
} {
  if (typeof raw !== 'object' || raw === null) {
    throw new ValidationError('Invalid setup output', { raw })
  }

  const obj = raw as Record<string, unknown>

  if (obj.installation !== null && typeof obj.installation !== 'string') {
    throw new ValidationError('Invalid setup output', { raw })
  }

  if (
    obj.runCommand !== undefined &&
    obj.runCommand !== null &&
    typeof obj.runCommand !== 'string'
  ) {
    throw new ValidationError('Invalid setup output', { raw })
  }

  if (
    obj.nextSteps !== undefined &&
    (!Array.isArray(obj.nextSteps) ||
      !obj.nextSteps.every((item) => typeof item === 'string'))
  ) {
    throw new ValidationError('Invalid setup next steps output', { raw })
  }

  return {
    installation: (obj.installation as string | null) ?? null,
    runCommand:
      obj.runCommand === undefined
        ? undefined
        : (obj.runCommand as string | null),
    nextSteps: obj.nextSteps as string[] | undefined,
  }
}
