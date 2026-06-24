import type { RepoType } from '../classify/types'
import type {
  DirectoryRoleSignal,
  ImportantFileSignal,
} from '../extractors/types'

// Influenced by: extractReadmeInfo + extractMetadataInfo
interface IdentityContext {
  name: string | null
  description: string | null
  repoType?: RepoType
  topics?: string[]
  stars?: number | null
}

// Influenced by: extractPackageInfo
interface TechContext {
  language: string | null
  framework: string | null
  runtime: string | null
  packageManager: string | null
  dependencies?: string[]
  devDependencies?: string[]
  scripts?: Record<string, string | null>
}

// Influenced by: extractTreeInfo (+ defaultBranch internally)
interface StructureContext {
  overview: string[]
  entryPoints?: {
    kind: 'cli' | 'library'
    value: string
  }[]
  topLevelDirectories?: string[]
  topLevelFiles?: string[]
  importantFiles?: ImportantFileSignal[]
  directoryRoles?: DirectoryRoleSignal[]
  architecturalSignals?: string[]
  counts?: {
    files: number
    directories: number
    testFiles: number
    configFiles: number
    apiRoutes: number
    documentationFiles: number
  }
}

// Influenced by: extractReadmeInfo + extractPackageInfo
interface SetupContext {
  installation: string | null
  runCommand: string | null
  scripts?: Record<string, string | null>
  packageManager: string | null
}

interface OnboardingContext {
  identity: IdentityContext
  tech: TechContext
  structure: StructureContext
  setup: SetupContext
}

interface RepoContext {
  identity: IdentityContext
  tech: TechContext
  structure: StructureContext
  setup: SetupContext
  onboarding?: OnboardingContext
}

export type {
  IdentityContext,
  TechContext,
  StructureContext,
  SetupContext,
  OnboardingContext,
  RepoContext,
}
