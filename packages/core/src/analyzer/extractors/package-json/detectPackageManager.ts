import type { RawPackageJson } from '../types'

export function detectPackageManager(pkg: RawPackageJson): string | null {
  if (typeof pkg.packageManager === 'string') {
    const pm = pkg.packageManager.toLowerCase()
    if (pm.startsWith('pnpm@')) return 'pnpm'
    if (pm.startsWith('yarn@')) return 'yarn'
    if (pm.startsWith('bun@')) return 'bun'
    if (pm.startsWith('npm@')) return 'npm'
  }

  if (pkg.pnpm?.overrides || pkg.pnpm?.patchedDependencies) {
    return 'pnpm'
  }

  return null
}
