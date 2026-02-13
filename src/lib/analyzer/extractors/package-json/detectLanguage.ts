export function detectLanguage(
  dependencies: string[],
  devDependencies: string[]
): string {
  const tsIndicators = [
    'typescript',
    '@types/node',
    'ts-node',
    'tsx',
    '@typescript-eslint/parser',
  ]

  const allDeps = [...dependencies, ...devDependencies]
  const hasTypeScript = tsIndicators.some((indicator) =>
    allDeps.includes(indicator)
  )

  return hasTypeScript ? 'TypeScript' : 'JavaScript'
}
