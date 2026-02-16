import type { RawMetadata } from '@/schema/metadataSchema'
import type { RawPackageJson } from '@/schema/packageJsonSchema'
import type { RawRepoTree } from '@/schema/treeSchema'

// Tree
interface TreeSignals {
  hasDocker: boolean
  hasCI: boolean
  hasTests: boolean
}

type ConfidenceLevel = 'explicit' | 'inferred' | 'unknown'

type EntryPointValue = { value: string | null; confidence: ConfidenceLevel }
// type EntryPointValue =
//   | { kind: 'runtime'; value: string }
//   | { kind: 'cli'; value: string }
//   | { kind: 'library'; value: string }

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

// Readme
interface ReadmeInfo {
  title: string | null
  description: string | null
  installation: string | null
  raw?: string | null
}

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

  // Declared entry intent
  main?: string | null
  module?: string | null
  exports?: unknown
  bin?: Record<string, string>
}

interface MetadataInfo {
  name: string
  description: string | null
  language: string | null
  topics: string[]
  license: string | null
  defaultBranch: string | null
}

interface FrameworkSignature {
  deps: string[]
  framework: string
  runtime?: string
}

type TechSignal = {
  language?: { value: string; confidence: ConfidenceLevel }
  framework?: { value: string; confidence: ConfidenceLevel }
}

interface DetectionPatterns {
  configFiles: Map<string, TechSignal>
  testPatterns: RegExp[]
  ciPatterns: RegExp[]
  dockerPatterns: RegExp[]
}

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
