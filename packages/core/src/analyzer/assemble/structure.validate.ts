import { ValidationError } from '../../error'
import { normalizeStringArray } from './normalizeOutput'

export function validateStructureOutput(raw: unknown): {
  overview: string[]
  entryPoints?: string[]
  importantFiles?: string[]
  architecture?: string[]
  featureSignals?: string[]
  complexity?: string[]
} {
  if (Array.isArray(raw)) {
    const overview = normalizeStringArray(raw)
    if (!overview) {
      throw new ValidationError('Invalid structure overview', { raw })
    }
    return { overview }
  }

  if (typeof raw !== 'object' || raw === null) {
    throw new ValidationError('Invalid structure output', { raw })
  }

  const obj = raw as Record<string, unknown>
  const overview = normalizeStringArray(obj.overview)

  if (!overview) {
    throw new ValidationError('Invalid structure overview', { raw })
  }

  return {
    overview,
    entryPoints:
      obj.entryPoints === null
        ? undefined
        : normalizeStringArray(obj.entryPoints),
    importantFiles: normalizeStringArray(obj.importantFiles),
    architecture: normalizeStringArray(obj.architecture),
    featureSignals: normalizeStringArray(obj.featureSignals),
    complexity: normalizeStringArray(obj.complexity),
  }
}
