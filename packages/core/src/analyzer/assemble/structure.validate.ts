import { ValidationError } from '../../error'

export function validateStructureOutput(raw: unknown): {
  overview: string[]
  entryPoints?: string[]
} {
  if (typeof raw !== 'object' || raw === null) {
    throw new ValidationError('Invalid structure output', { raw })
  }

  const obj = raw as Record<string, unknown>

  if (
    !Array.isArray(obj.overview) ||
    !obj.overview.every((item: unknown) => typeof item === 'string')
  ) {
    throw new ValidationError('Invalid structure overview', { raw })
  }

  if (
    obj.entryPoints !== undefined &&
    obj.entryPoints !== null &&
    (!Array.isArray(obj.entryPoints) ||
      !obj.entryPoints.every((item: unknown) => typeof item === 'string'))
  ) {
    throw new ValidationError('Invalid structure entryPoints', { raw })
  }

  return {
    overview: obj.overview as string[],
    entryPoints:
      obj.entryPoints === undefined ? undefined : (obj.entryPoints as string[]),
  }
}
