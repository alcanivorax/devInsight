const STRING_KEYS = [
  'name',
  'path',
  'library',
  'package',
  'summary',
  'description',
  'detail',
  'reason',
  'message',
  'value',
  'command',
  'title',
]

export function normalizeString(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return null
}

export function normalizeStringArray(value: unknown): string[] | undefined {
  const items = collectStrings(value)
  return items.length > 0 ? [...new Set(items)] : undefined
}

export function joinStringValues(values: unknown[]): string | null {
  const items = values.flatMap((value) => collectStrings(value))
  const uniqueItems = [...new Set(items)]
  return uniqueItems.length > 0 ? uniqueItems.join(', ') : null
}

function collectStrings(value: unknown): string[] {
  const normalized = normalizeString(value)
  if (normalized) {
    return [normalized]
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectStrings(item))
  }
  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>
    const keyedValues = STRING_KEYS.flatMap((key) => collectStrings(obj[key]))
    if (keyedValues.length > 0) {
      return keyedValues
    }
  }
  return []
}
