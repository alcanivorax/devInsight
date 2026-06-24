import { ValidationError } from '../../error'

export function validateTechOutput(raw: unknown): {
  stack: string
  notableLibraries?: string[]
  dependencyInsights?: string[]
} {
  if (
    typeof raw !== 'object' ||
    raw === null ||
    typeof (raw as Record<string, unknown>).stack !== 'string'
  ) {
    throw new ValidationError('Invalid tech output', { raw })
  }

  const obj = raw as Record<string, unknown>

  if (
    obj.notableLibraries !== undefined &&
    (!Array.isArray(obj.notableLibraries) ||
      !obj.notableLibraries.every((item) => typeof item === 'string'))
  ) {
    throw new ValidationError('Invalid notable libraries output', { raw })
  }

  if (
    obj.dependencyInsights !== undefined &&
    (!Array.isArray(obj.dependencyInsights) ||
      !obj.dependencyInsights.every((item) => typeof item === 'string'))
  ) {
    throw new ValidationError('Invalid dependency insights output', { raw })
  }

  return {
    stack: obj.stack as string,
    notableLibraries: obj.notableLibraries as string[] | undefined,
    dependencyInsights: obj.dependencyInsights as string[] | undefined,
  }
}
