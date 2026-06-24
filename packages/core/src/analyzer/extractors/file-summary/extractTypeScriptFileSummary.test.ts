import { describe, expect, it } from 'vitest'
import {
  extractTypeScriptFileSummaries,
  extractTypeScriptFileSummary,
} from './extractTypeScriptFileSummary'

describe('extractTypeScriptFileSummary', () => {
  it('extracts imports, exports, declarations, functions, and metrics', () => {
    const source = `import React, { useMemo as useMemoAlias } from 'react'
import type { RepoData } from '../types'
import * as fs from 'node:fs'
import './setup'

export interface AnalyzeOptions {
  readonly dryRun?: boolean
}

type LocalState = {
  ready: boolean
}

export type AnalyzeResult = {
  summary: string
}

export async function analyzeRepo(repo: RepoData): Promise<AnalyzeResult> {
  return { summary: repo.metadata?.name ?? 'unknown' }
}

const localHelper = () => true

export const createSummary = (name: string): string => name.trim()

export class RepoAnalyzer {}

export { parseRepoInput } from '../utils'
export * from './tree'
export default analyzeRepo
`

    const result = extractTypeScriptFileSummary({
      path: 'src/analyze.ts',
      source,
    })

    expect(result.path).toBe('src/analyze.ts')
    expect(result.language).toBe('typescript')
    expect(result.imports).toEqual([
      {
        source: 'react',
        defaultImport: 'React',
        namespaceImport: null,
        namedImports: ['useMemoAlias'],
        isTypeOnly: false,
      },
      {
        source: '../types',
        defaultImport: null,
        namespaceImport: null,
        namedImports: ['RepoData'],
        isTypeOnly: true,
      },
      {
        source: 'node:fs',
        defaultImport: null,
        namespaceImport: 'fs',
        namedImports: [],
        isTypeOnly: false,
      },
      {
        source: './setup',
        defaultImport: null,
        namespaceImport: null,
        namedImports: [],
        isTypeOnly: false,
      },
    ])

    expect(result.declarations).toEqual(
      expect.arrayContaining([
        { name: 'AnalyzeOptions', kind: 'interface', exported: true },
        { name: 'LocalState', kind: 'type', exported: false },
        { name: 'AnalyzeResult', kind: 'type', exported: true },
        expect.objectContaining({
          name: 'analyzeRepo',
          kind: 'function',
          exported: true,
        }),
        { name: 'localHelper', kind: 'variable', exported: false },
        { name: 'createSummary', kind: 'variable', exported: true },
        { name: 'RepoAnalyzer', kind: 'class', exported: true },
      ])
    )

    expect(result.functions).toEqual(
      expect.arrayContaining([
        {
          name: 'analyzeRepo',
          kind: 'function',
          exported: true,
          async: true,
          parameters: ['repo'],
          returnType: 'Promise<AnalyzeResult>',
        },
        {
          name: 'createSummary',
          kind: 'function',
          exported: true,
          async: false,
          parameters: ['name'],
          returnType: 'string',
        },
      ])
    )

    expect(result.exports).toEqual(
      expect.arrayContaining([
        { name: 'AnalyzeOptions', kind: 'interface', source: null },
        { name: 'AnalyzeResult', kind: 'type', source: null },
        { name: 'analyzeRepo', kind: 'function', source: null },
        { name: 'createSummary', kind: 'variable', source: null },
        { name: 'RepoAnalyzer', kind: 'class', source: null },
        { name: 'parseRepoInput', kind: 're-export', source: '../utils' },
        { name: '*', kind: 're-export', source: './tree' },
        { name: 'default', kind: 'default', source: null },
      ])
    )

    expect(result.metrics).toMatchObject({
      imports: 4,
      exports: 8,
      functions: 3,
      classes: 1,
      interfaces: 1,
      types: 2,
      enums: 0,
    })
  })

  it('detects TSX files', () => {
    const result = extractTypeScriptFileSummary({
      path: 'src/Button.tsx',
      source: `export function Button() {
  return <button>Save</button>
}`,
    })

    expect(result.language).toBe('tsx')
    expect(result.functions[0]).toMatchObject({
      name: 'Button',
      exported: true,
    })
  })

  it('extracts declaration-style default exports', () => {
    const result = extractTypeScriptFileSummary({
      path: 'src/create.ts',
      source: `export default function createAnalyzer() {
  return null
}`,
    })

    expect(result.declarations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'createAnalyzer',
          kind: 'function',
          exported: true,
        }),
      ])
    )
    expect(result.exports).toEqual([
      { name: 'default', kind: 'default', source: null },
    ])
  })

  it('summarizes multiple files', () => {
    const result = extractTypeScriptFileSummaries([
      { path: 'src/a.ts', source: 'export const a = 1' },
      { path: 'src/b.tsx', source: 'export function B() { return null }' },
    ])

    expect(result.map((summary) => summary.path)).toEqual([
      'src/a.ts',
      'src/b.tsx',
    ])
  })
})
