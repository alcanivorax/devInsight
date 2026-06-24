import type { TechContext } from './types'
import type { PackageInfo } from '../extractors/types'
import type { ResolvedTechInfo } from '../merge/types'

export function createTechContext(
  resolved: ResolvedTechInfo,
  packageInfo?: PackageInfo
): TechContext {
  return {
    language: resolved.language,
    framework: resolved.framework,
    runtime: resolved.runtime,
    packageManager: resolved.packageManager,
    dependencies: packageInfo?.dependencies.slice(0, 20),
    devDependencies: packageInfo?.devDependencies.slice(0, 20),
    scripts: packageInfo?.scripts,
  }
}
