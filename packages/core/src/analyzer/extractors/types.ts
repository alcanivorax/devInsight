import type { RawMetadata } from '../../schemas/metadata.schema'
import type { RawPackageJson } from '../../schemas/packageJson.schema'
import type { RawRepoTree } from '../../schemas/tree.schema'

// ─── Tree ────────────────────────────────────────────────────────────────────

interface TreeSignals {
  hasDocker: boolean
  hasCI: boolean
  hasTests: boolean
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
  TechHints,
  EntryPointValue,
  DetectionPatterns,
  TechSignal,
  ReadmeInfo,
  PackageInfo,
  FrameworkSignature,
  MetadataInfo,
  RawMetadata,
  RawPackageJson,
  RawRepoTree,
}
