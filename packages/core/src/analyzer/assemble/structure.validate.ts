import { ValidationError } from '../../error'

export function validateStructureOutput(raw: unknown): {
  overview: string[]
  entryPoints?: string[]
  importantFiles?: string[]
  architecture?: string[]
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

  if (
    obj.importantFiles !== undefined &&
    (!Array.isArray(obj.importantFiles) ||
      !obj.importantFiles.every((item: unknown) => typeof item === 'string'))
  ) {
    throw new ValidationError('Invalid structure important files', { raw })
  }

  if (
    obj.architecture !== undefined &&
    (!Array.isArray(obj.architecture) ||
      !obj.architecture.every((item: unknown) => typeof item === 'string'))
  ) {
    throw new ValidationError('Invalid structure architecture', { raw })
  }

  return {
    overview: obj.overview as string[],
    entryPoints:
      obj.entryPoints === undefined ? undefined : (obj.entryPoints as string[]),
    importantFiles:
      obj.importantFiles === undefined
        ? undefined
        : (obj.importantFiles as string[]),
    architecture:
      obj.architecture === undefined
        ? undefined
        : (obj.architecture as string[]),
  }
}
