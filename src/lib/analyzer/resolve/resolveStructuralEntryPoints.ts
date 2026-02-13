import type { RepoType } from '../classify/types'
import type { PackageInfo } from '../extractors/types'

export type StructuralEntryPoint =
  | { kind: 'cli'; value: string }
  | { kind: 'library'; value: string }

export function resolveStructuralEntryPoints(input: {
  packageInfo: PackageInfo
  repoType: RepoType
}): StructuralEntryPoint[] {
  const entries: StructuralEntryPoint[] = []
  const pkg = input.packageInfo

  // CLI entry points (explicit contract)
  if (pkg.bin) {
    for (const name of Object.keys(pkg.bin)) {
      entries.push({ kind: 'cli', value: name })
    }
  }

  // Library entry point (explicit contract)
  if (input.repoType === 'library' && pkg.main) {
    entries.push({ kind: 'library', value: pkg.main })
  }

  return entries
}
