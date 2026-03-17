import { ValidationError } from '../../error'

export function validateSetupOutput(raw: unknown): {
  installation: string | null
  runCommand?: string | null
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

  return {
    installation: (obj.installation as string | null) ?? null,
    runCommand:
      obj.runCommand === undefined
        ? undefined
        : (obj.runCommand as string | null),
  }
}
