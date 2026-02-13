import type { RawRepoTree } from '../../types'

export const dummyTree: RawRepoTree = [
  // Root files
  {
    path: 'README.md',
    type: 'blob',
  },
  {
    path: 'package.json',
    type: 'blob',
  },
  {
    path: 'tsconfig.json',
    type: 'blob',
  },
  {
    path: 'next.config.ts',
    type: 'tree',
  },

  {
    path: 'Dockerfile',
    type: 'blob',
  },

  // CI
  {
    path: '.github/workflows/ci.yml',
    type: 'blob',
  },

  // Source
  {
    path: 'src/index.ts',
    type: 'blob',
    size: 234,
  },
  {
    path: 'src/app.ts',
    type: 'blob',
  },
  {
    path: 'src',
    type: 'tree',
  },

  // Tests
  {
    path: 'tests/app.test.ts',
    type: 'blob',
  },
]
