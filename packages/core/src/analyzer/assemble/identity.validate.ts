import { ValidationError } from '../../error'

export function validateIdentityOutput(raw: unknown): {
  summary: string
  purpose?: string | null
  audience?: string | null
} {
  if (
    typeof raw !== 'object' ||
    raw === null ||
    typeof (raw as Record<string, unknown>).summary !== 'string'
  ) {
    throw new ValidationError('Invalid identity output', { raw })
  }

  const obj = raw as Record<string, unknown>

  if (
    obj.purpose !== undefined &&
    obj.purpose !== null &&
    typeof obj.purpose !== 'string'
  ) {
    throw new ValidationError('Invalid identity purpose', { raw })
  }

  if (
    obj.audience !== undefined &&
    obj.audience !== null &&
    typeof obj.audience !== 'string'
  ) {
    throw new ValidationError('Invalid identity audience', { raw })
  }

  return {
    summary: obj.summary as string,
    purpose: obj.purpose as string | null | undefined,
    audience: obj.audience as string | null | undefined,
  }
}
