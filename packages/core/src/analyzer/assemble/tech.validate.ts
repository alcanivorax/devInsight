import { ValidationError } from '../../error'
import { joinStringValues, normalizeStringArray } from './normalizeOutput'

export function validateTechOutput(raw: unknown): {
  stack: string
  notableLibraries?: string[]
  dependencyInsights?: string[]
} {
  const rawStack = joinStringValues([raw])
  if (rawStack && (typeof raw === 'string' || Array.isArray(raw))) {
    return { stack: rawStack }
  }

  if (typeof raw !== 'object' || raw === null) {
    throw new ValidationError('Invalid tech output', { raw })
  }

  const obj = raw as Record<string, unknown>
  const stack = normalizeStack(obj)

  if (!stack) {
    throw new ValidationError('Invalid tech output', { raw })
  }

  return {
    stack,
    notableLibraries: normalizeStringArray(obj.notableLibraries),
    dependencyInsights: normalizeStringArray(obj.dependencyInsights),
  }
}

function normalizeStack(obj: Record<string, unknown>): string | null {
  const stack = obj.stack
  if (typeof stack === 'string' && stack.trim()) {
    return stack.trim()
  }
  if (Array.isArray(stack)) {
    return joinStringValues(stack)
  }

  return (
    joinStringValues([
      obj.language,
      obj.languages,
      obj.framework,
      obj.frameworks,
      obj.runtime,
      obj.runtimes,
      obj.packageManager,
      obj.packageManagers,
      obj.techStack,
      obj.technologies,
    ]) ?? null
  )
}
