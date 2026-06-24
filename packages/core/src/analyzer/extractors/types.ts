import type { RawMetadata } from '../../schemas/metadata.schema'
import type { RawPackageJson } from '../../schemas/packageJson.schema'
import type { RawRepoTree } from '../../schemas/tree.schema'

// ─── Tree ────────────────────────────────────────────────────────────────────

interface TreeSignals {
  hasDocker: boolean
  hasCI: boolean
  hasTests: boolean
}

interface ImportantFileSignal {
  path: string
  reason: string
}

interface DirectoryRoleSignal {
  path: string
  role: string
}

interface RepositoryMap {
  topLevelDirectories: string[]
  topLevelFiles: string[]
  importantFiles: ImportantFileSignal[]
  directoryRoles: DirectoryRoleSignal[]
  architecturalSignals: string[]
  counts: {
    files: number
    directories: number
    testFiles: number
    configFiles: number
    apiRoutes: number
    documentationFiles: number
  }
}

type ConfidenceLevel = 'explicit' | 'inferred' | 'unknown'

type EntryPointValue = { value: string | null; confidence: ConfidenceLevel }

// ─── Tech ────────────────────────────────────────────────────────────────────

interface TechHints {
  language: {
    value: string | null
    confidence: ConfidenceLevel
  }
  framework: {
    value: string | null
    confidence: ConfidenceLevel
  }
}

type TechSignal = {
  language?: { value: string; confidence: ConfidenceLevel }
  framework?: { value: string; confidence: ConfidenceLevel }
}

// ─── Readme ──────────────────────────────────────────────────────────────────

interface ReadmeInfo {
  title: string | null
  description: string | null
  installation: string | null
  raw?: string | null
}

// ─── Package.json ─────────────────────────────────────────────────────────────

interface PackageInfo {
  name: string | null
  version: string | null
  description: string | null

  language: string | null
  framework: string | null
  runtime: string | null
  packageManager: string | null

  scripts: {
    dev: string | null
    build: string | null
    start: string | null
    test: string | null
  }

  dependencies: string[]
  devDependencies: string[]

  main?: string | null
  module?: string | null
  exports?: unknown
  bin?: Record<string, string>
}

// ─── Metadata ────────────────────────────────────────────────────────────────

interface MetadataInfo {
  name: string
  description: string | null
  language: string | null
  topics: string[]
  license: string | null
  defaultBranch: string | null
  stars: number | null
  openIssues: number | null
}

// ─── File Summary ────────────────────────────────────────────────────────────

type FileLanguage = 'typescript' | 'tsx' | 'javascript' | 'jsx' | 'unknown'

interface FileImportSummary {
  source: string
  defaultImport: string | null
  namespaceImport: string | null
  namedImports: string[]
  isTypeOnly: boolean
}

type FileExportKind =
  | 'function'
  | 'class'
  | 'interface'
  | 'type'
  | 'enum'
  | 'variable'
  | 're-export'
  | 'default'

interface FileExportSummary {
  name: string
  kind: FileExportKind
  source: string | null
}

type FileDeclarationKind =
  | 'function'
  | 'class'
  | 'interface'
  | 'type'
  | 'enum'
  | 'variable'

interface FileDeclarationSummary {
  name: string
  kind: FileDeclarationKind
  exported: boolean
}

interface FileFunctionSummary extends FileDeclarationSummary {
  kind: 'function'
  async: boolean
  parameters: string[]
  returnType: string | null
}

interface FileSummaryMetrics {
  lines: number
  imports: number
  exports: number
  functions: number
  classes: number
  interfaces: number
  types: number
  enums: number
}

interface FileSummary {
  path: string
  language: FileLanguage
  imports: FileImportSummary[]
  exports: FileExportSummary[]
  declarations: FileDeclarationSummary[]
  functions: FileFunctionSummary[]
  metrics: FileSummaryMetrics
}

// ─── Detection ───────────────────────────────────────────────────────────────

interface FrameworkSignature {
  deps: string[]
  framework: string
  runtime?: string
}

interface DetectionPatterns {
  configFiles: Map<string, TechSignal>
  testPatterns: RegExp[]
  ciPatterns: RegExp[]
  dockerPatterns: RegExp[]
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export type {
  ConfidenceLevel,
  TreeSignals,
  ImportantFileSignal,
  DirectoryRoleSignal,
  RepositoryMap,
  TechHints,
  EntryPointValue,
  DetectionPatterns,
  TechSignal,
  ReadmeInfo,
  PackageInfo,
  FrameworkSignature,
  MetadataInfo,
  FileLanguage,
  FileImportSummary,
  FileExportKind,
  FileExportSummary,
  FileDeclarationKind,
  FileDeclarationSummary,
  FileFunctionSummary,
  FileSummaryMetrics,
  FileSummary,
  RawMetadata,
  RawPackageJson,
  RawRepoTree,
}
