import { describe, expect, it } from 'vitest'
import { extractRepositoryMap } from './extractRepositoryMap'
import type { RawRepoTree } from '../types'

describe('extractRepositoryMap', () => {
  it('extracts layout, important files, architectural signals, and counts', () => {
    const tree: RawRepoTree = [
      { path: 'src', type: 'tree' },
      { path: 'src/app', type: 'tree' },
      { path: 'src/app/api', type: 'tree' },
      { path: 'src/app/api/analyze/route.ts', type: 'blob' },
      { path: 'src/app/page.tsx', type: 'blob' },
      { path: 'src/lib', type: 'tree' },
      { path: 'src/lib/auth.ts', type: 'blob' },
      { path: 'src/lib/prisma.ts', type: 'blob' },
      { path: 'packages', type: 'tree' },
      { path: 'packages/core', type: 'tree' },
      { path: 'prisma', type: 'tree' },
      { path: 'prisma/schema.prisma', type: 'blob' },
      { path: 'docs', type: 'tree' },
      { path: 'docs/architecture.md', type: 'blob' },
      { path: '.github/workflows/ci.yml', type: 'blob' },
      { path: 'package.json', type: 'blob' },
      { path: 'pnpm-workspace.yaml', type: 'blob' },
      { path: 'tsconfig.json', type: 'blob' },
      { path: 'src/app/page.test.tsx', type: 'blob' },
      { path: 'README.md', type: 'blob' },
    ]

    const result = extractRepositoryMap(tree)

    expect(result.topLevelDirectories).toEqual(
      expect.arrayContaining(['src', 'packages', 'prisma', 'docs', '.github'])
    )
    expect(result.topLevelFiles).toEqual(
      expect.arrayContaining([
        'package.json',
        'pnpm-workspace.yaml',
        'README.md',
      ])
    )
    expect(result.importantFiles).toEqual(
      expect.arrayContaining([
        {
          path: 'src/app/api/analyze/route.ts',
          reason: 'Implements a Next.js API route.',
        },
        {
          path: 'prisma/schema.prisma',
          reason:
            'Defines Prisma database models and datasource configuration.',
        },
      ])
    )
    expect(result.directoryRoles).toEqual(
      expect.arrayContaining([
        { path: 'src/app/api', role: 'HTTP API route handlers.' },
        { path: 'packages/core', role: 'Core reusable analysis logic.' },
      ])
    )
    expect(result.architecturalSignals).toEqual(
      expect.arrayContaining([
        'Next.js API route layer is present.',
        'Prisma database schema is present.',
        'Repository uses a packages-based workspace layout.',
      ])
    )
    expect(result.featureSignals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'HTTP API surface',
          evidence: ['src/app/api/analyze/route.ts'],
        }),
        expect.objectContaining({
          name: 'Authentication',
          evidence: ['src/lib/auth.ts'],
        }),
        expect.objectContaining({
          name: 'Database layer',
          evidence: ['prisma/schema.prisma', 'src/lib/prisma.ts'],
        }),
      ])
    )
    expect(result.complexityIndicators).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: 'Compact codebase' }),
        expect.objectContaining({ label: 'API surface area' }),
        expect.objectContaining({ label: 'Test coverage signal' }),
      ])
    )
    expect(result.counts).toMatchObject({
      files: 12,
      directories: 8,
      testFiles: 1,
      apiRoutes: 1,
      documentationFiles: 2,
    })
  })
})
