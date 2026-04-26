import type { PackageInfo, RawPackageJson } from '../types'
import { detectFramework } from './detectFramework'
import { detectLanguage } from './detectLanguage'
import { detectPackageManager } from './detectPackageManager'
import { detectRuntime } from './detectRuntime'

export function extractPackageJsonInfo(
  packageJson: RawPackageJson
): PackageInfo {
  const deps = Object.keys(packageJson.dependencies || {})
  const devDeps = Object.keys(packageJson.devDependencies || {})
  const allDeps = [...deps, ...devDeps]

  const framework = detectFramework(allDeps)
  const runtime = detectRuntime(allDeps, packageJson.engines ?? null)
  const packageManager = detectPackageManager(packageJson)
  const language = detectLanguage(deps, devDeps)
  const bin =
    typeof packageJson.bin === 'string'
      ? { [packageJson.name ?? 'bin']: packageJson.bin }
      : packageJson.bin

  return {
    name: packageJson.name ?? null,
    version: packageJson.version ?? null,
    description: packageJson.description ?? null,
    language,
    framework,
    runtime,
    packageManager,
    scripts: {
      dev: packageJson.scripts?.dev ?? packageJson.scripts?.develop ?? null,
      build: packageJson.scripts?.build ?? null,
      start: packageJson.scripts?.start ?? null,
      test: packageJson.scripts?.test ?? null,
    },
    dependencies: deps,
    devDependencies: devDeps,
    main: packageJson.main ?? null,
    module: packageJson.module ?? null,
    exports: packageJson.exports,
    bin,
  }
}
