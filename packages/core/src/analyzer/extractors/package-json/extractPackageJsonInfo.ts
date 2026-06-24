import type { DependencyInsight, PackageInfo, RawPackageJson } from '../types'
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
      lint: packageJson.scripts?.lint ?? null,
      checkTypes:
        packageJson.scripts?.['check-types'] ??
        packageJson.scripts?.typecheck ??
        null,
      format:
        packageJson.scripts?.['format:check'] ??
        packageJson.scripts?.format ??
        null,
    },
    allScripts: packageJson.scripts ?? {},
    dependencies: deps,
    devDependencies: devDeps,
    dependencyInsights: extractDependencyInsights(deps, devDeps),
    main: packageJson.main ?? null,
    module: packageJson.module ?? null,
    exports: packageJson.exports,
    bin,
  }
}

const DEPENDENCY_CATALOG: Record<
  string,
  Omit<DependencyInsight, 'name' | 'scope'>
> = {
  next: {
    category: 'framework',
    reason: 'Next.js application framework.',
  },
  react: {
    category: 'ui',
    reason: 'React UI runtime.',
  },
  'react-dom': {
    category: 'ui',
    reason: 'React browser rendering runtime.',
  },
  '@openrouter/sdk': {
    category: 'ai',
    reason: 'OpenRouter model provider SDK.',
  },
  ai: {
    category: 'ai',
    reason: 'Vercel AI SDK for model orchestration.',
  },
  '@ai-sdk/google': {
    category: 'ai',
    reason: 'Google model provider integration.',
  },
  '@prisma/client': {
    category: 'data',
    reason: 'Generated Prisma database client.',
  },
  prisma: {
    category: 'data',
    reason: 'Prisma schema and migration tooling.',
  },
  pg: {
    category: 'data',
    reason: 'PostgreSQL database driver.',
  },
  'better-auth': {
    category: 'auth',
    reason: 'Application authentication framework.',
  },
  octokit: {
    category: 'github',
    reason: 'GitHub API client.',
  },
  zod: {
    category: 'validation',
    reason: 'Runtime schema validation.',
  },
  vitest: {
    category: 'testing',
    reason: 'Unit test runner.',
  },
  '@testing-library/react': {
    category: 'testing',
    reason: 'React component testing utilities.',
  },
  typescript: {
    category: 'tooling',
    reason: 'Static type checking.',
  },
  eslint: {
    category: 'tooling',
    reason: 'Linting and code quality checks.',
  },
  prettier: {
    category: 'tooling',
    reason: 'Code formatting.',
  },
  tailwindcss: {
    category: 'tooling',
    reason: 'Utility-first CSS tooling.',
  },
}

function extractDependencyInsights(
  dependencies: string[],
  devDependencies: string[]
): DependencyInsight[] {
  const insights: DependencyInsight[] = []

  for (const name of dependencies) {
    addDependencyInsight(insights, name, 'runtime')
  }

  for (const name of devDependencies) {
    addDependencyInsight(insights, name, 'development')
  }

  return insights.slice(0, 14)
}

function addDependencyInsight(
  insights: DependencyInsight[],
  name: string,
  scope: DependencyInsight['scope']
): void {
  const catalogEntry = DEPENDENCY_CATALOG[name]
  if (!catalogEntry) return

  insights.push({
    name,
    scope,
    ...catalogEntry,
  })
}
