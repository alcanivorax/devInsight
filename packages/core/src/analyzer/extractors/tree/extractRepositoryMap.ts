import type {
  DirectoryRoleSignal,
  ImportantFileSignal,
  RawRepoTree,
  RepositoryMap,
} from '../types'

const IMPORTANT_FILE_RULES: {
  pattern: RegExp
  reason: string
}[] = [
  {
    pattern: /^package\.json$/,
    reason: 'Defines package metadata, scripts, and JavaScript dependencies.',
  },
  {
    pattern: /^pnpm-workspace\.yaml$/,
    reason: 'Defines a pnpm monorepo workspace.',
  },
  {
    pattern: /^turbo\.json$/,
    reason: 'Defines Turborepo task orchestration.',
  },
  {
    pattern: /^next\.config\.[cm]?[jt]s$/,
    reason: 'Configures a Next.js application.',
  },
  {
    pattern: /^vite\.config\.[cm]?[jt]s$/,
    reason: 'Configures a Vite-powered application or library.',
  },
  {
    pattern: /^tsconfig\.json$/,
    reason: 'Configures TypeScript compilation.',
  },
  {
    pattern: /^prisma\/schema\.prisma$/,
    reason: 'Defines Prisma database models and datasource configuration.',
  },
  {
    pattern: /^src\/app\/api\/.+\/route\.[jt]s$/,
    reason: 'Implements a Next.js API route.',
  },
  {
    pattern: /^src\/app\/page\.tsx$/,
    reason: 'Implements the primary Next.js page.',
  },
  {
    pattern: /^src\/app\/layout\.tsx$/,
    reason: 'Defines the root Next.js application layout.',
  },
  {
    pattern: /^src\/lib\/auth\.[jt]s$/,
    reason: 'Defines server-side authentication helpers.',
  },
  {
    pattern: /^src\/lib\/prisma\.[jt]s$/,
    reason: 'Defines Prisma database client access.',
  },
  {
    pattern: /^\.github\/workflows\/.+\.ya?ml$/,
    reason: 'Defines GitHub Actions automation.',
  },
  {
    pattern: /^dockerfile$/i,
    reason: 'Defines a Docker image build.',
  },
  {
    pattern: /^docker-compose\.ya?ml$/,
    reason: 'Defines local multi-service Docker orchestration.',
  },
  {
    pattern: /^readme\.md$/i,
    reason: 'Provides the main repository documentation.',
  },
]

const DIRECTORY_ROLE_RULES: {
  pattern: RegExp
  role: string
}[] = [
  { pattern: /^src\/app$/, role: 'Next.js app router pages and layouts.' },
  { pattern: /^src\/app\/api$/, role: 'HTTP API route handlers.' },
  { pattern: /^src\/components$/, role: 'Reusable UI components.' },
  { pattern: /^src\/lib$/, role: 'Shared application utilities and clients.' },
  { pattern: /^packages$/, role: 'Workspace packages.' },
  { pattern: /^packages\/core$/, role: 'Core reusable analysis logic.' },
  { pattern: /^prisma$/, role: 'Database schema and Prisma configuration.' },
  { pattern: /^docs$/, role: 'Project documentation.' },
  { pattern: /^test(s)?$/, role: 'Test support or test suites.' },
  { pattern: /^\.github\/workflows$/, role: 'GitHub Actions workflows.' },
]

export function extractRepositoryMap(tree: RawRepoTree): RepositoryMap {
  const topLevelDirectories = new Set<string>()
  const topLevelFiles = new Set<string>()
  const importantFiles: ImportantFileSignal[] = []
  const directoryRoles: DirectoryRoleSignal[] = []
  const architecturalSignals = new Set<string>()

  let files = 0
  let directories = 0
  let testFiles = 0
  let configFiles = 0
  let apiRoutes = 0
  let documentationFiles = 0

  for (const item of tree) {
    const normalized = item.path.replace(/\\/g, '/')
    const lower = normalized.toLowerCase()
    const [topLevel] = normalized.split('/')

    if (item.type === 'tree') {
      directories += 1
      if (topLevel) topLevelDirectories.add(topLevel)

      for (const rule of DIRECTORY_ROLE_RULES) {
        if (rule.pattern.test(lower)) {
          addUniqueDirectoryRole(directoryRoles, normalized, rule.role)
        }
      }

      continue
    }

    files += 1
    if (normalized.includes('/')) {
      if (topLevel) topLevelDirectories.add(topLevel)
    } else {
      topLevelFiles.add(normalized)
    }

    if (isTestPath(lower)) testFiles += 1
    if (isConfigPath(lower)) configFiles += 1
    if (isDocumentationPath(lower)) documentationFiles += 1
    if (/^src\/app\/api\/.+\/route\.[jt]s$/.test(lower)) apiRoutes += 1

    for (const rule of IMPORTANT_FILE_RULES) {
      if (rule.pattern.test(lower)) {
        addUniqueImportantFile(importantFiles, normalized, rule.reason)
      }
    }
  }

  addArchitecturalSignals(tree, architecturalSignals)

  return {
    topLevelDirectories: [...topLevelDirectories].sort(),
    topLevelFiles: [...topLevelFiles].sort(),
    importantFiles: importantFiles.slice(0, 16),
    directoryRoles: directoryRoles.slice(0, 12),
    architecturalSignals: [...architecturalSignals].sort(),
    counts: {
      files,
      directories,
      testFiles,
      configFiles,
      apiRoutes,
      documentationFiles,
    },
  }
}

function addArchitecturalSignals(
  tree: RawRepoTree,
  architecturalSignals: Set<string>
): void {
  const paths = new Set(tree.map((item) => item.path.toLowerCase()))

  if (hasPathPrefix(paths, 'src/app/api/')) {
    architecturalSignals.add('Next.js API route layer is present.')
  }

  if (hasPathPrefix(paths, 'src/app/')) {
    architecturalSignals.add('Next.js app router structure is present.')
  }

  if (hasPathPrefix(paths, 'packages/')) {
    architecturalSignals.add(
      'Repository uses a packages-based workspace layout.'
    )
  }

  if (paths.has('prisma/schema.prisma')) {
    architecturalSignals.add('Prisma database schema is present.')
  }

  if (
    hasPathPrefix(paths, 'src/lib/auth') ||
    hasPathPrefix(paths, 'src/auth')
  ) {
    architecturalSignals.add(
      'Authentication-related application code is present.'
    )
  }

  if (hasPathPrefix(paths, 'docs/')) {
    architecturalSignals.add('Dedicated documentation directory is present.')
  }

  if (hasPathPrefix(paths, '.github/workflows/')) {
    architecturalSignals.add(
      'GitHub Actions CI/workflow configuration is present.'
    )
  }
}

function hasPathPrefix(paths: Set<string>, prefix: string): boolean {
  for (const path of paths) {
    if (path.startsWith(prefix)) return true
  }

  return false
}

function addUniqueImportantFile(
  files: ImportantFileSignal[],
  path: string,
  reason: string
): void {
  if (!files.some((file) => file.path === path)) {
    files.push({ path, reason })
  }
}

function addUniqueDirectoryRole(
  directories: DirectoryRoleSignal[],
  path: string,
  role: string
): void {
  if (!directories.some((directory) => directory.path === path)) {
    directories.push({ path, role })
  }
}

function isTestPath(path: string): boolean {
  return (
    /(^|\/)(__tests__|tests?|spec)\//.test(path) ||
    /\.(test|spec)\.[jt]sx?$/.test(path) ||
    /_test\.(go|py)$/.test(path) ||
    /^test_.*\.py$/.test(path)
  )
}

function isConfigPath(path: string): boolean {
  return (
    /(^|\/)(package|tsconfig|next\.config|vite\.config|eslint\.config|postcss\.config|tailwind\.config)\./.test(
      path
    ) ||
    path === 'pnpm-workspace.yaml' ||
    path === 'turbo.json' ||
    path === 'prisma.config.ts'
  )
}

function isDocumentationPath(path: string): boolean {
  return (
    path === 'readme.md' || path.startsWith('docs/') || path.endsWith('.md')
  )
}
