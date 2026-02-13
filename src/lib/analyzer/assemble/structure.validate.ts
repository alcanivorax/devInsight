import { ValidationError } from '@/lib/error'

export function validateStructureOutput(raw: unknown): {
  overview: string[]
  entryPoints?: string[]
} {
  if (typeof raw !== 'object' || raw === null) {
    throw new ValidationError('Invalid structure output', { raw })
  }

  const obj = raw as any

  // overview: string[] (required)
  if (
    !Array.isArray(obj.overview) ||
    !obj.overview.every((item: any) => typeof item === 'string')
  ) {
    throw new ValidationError('Invalid structure overview', { raw })
  }

  // entryPoints?: string[]
  if (
    obj.entryPoints !== undefined &&
    obj.entryPoints !== null &&
    (!Array.isArray(obj.entryPoints) ||
      !obj.entryPoints.every((item: any) => typeof item === 'string'))
  ) {
    throw new ValidationError('Invalid structure entryPoints', { raw })
  }

  return {
    overview: obj.overview,
    entryPoints: obj.entryPoints === undefined ? undefined : obj.entryPoints,
  }
}
