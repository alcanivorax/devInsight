import { ValidationError } from '../../error'

export function validateTechOutput(raw: unknown): { stack: string } {
  if (
    typeof raw !== 'object' ||
    raw === null ||
    typeof (raw as Record<string, unknown>).stack !== 'string'
  ) {
    throw new ValidationError('Invalid tech output', { raw })
  }

  return raw as { stack: string }
}
