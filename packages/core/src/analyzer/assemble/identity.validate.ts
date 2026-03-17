import { ValidationError } from '../../error'

export function validateIdentityOutput(raw: unknown): { summary: string } {
  if (
    typeof raw !== 'object' ||
    raw === null ||
    typeof (raw as Record<string, unknown>).summary !== 'string'
  ) {
    throw new ValidationError('Invalid identity output', { raw })
  }

  return raw as { summary: string }
}
