import { describe, expect, it } from 'vitest'
import { validateStructureOutput } from './structure.validate'

describe('validateStructureOutput', () => {
  it('treats a bare string array as a structure overview', () => {
    expect(
      validateStructureOutput([
        'CI/CD configuration files are present.',
        'Test-related files or directories are present.',
      ])
    ).toEqual({
      overview: [
        'CI/CD configuration files are present.',
        'Test-related files or directories are present.',
      ],
    })
  })

  it('normalizes nested string arrays in optional structure fields', () => {
    expect(
      validateStructureOutput({
        overview: ['CI/CD configuration files are present.'],
        complexity: [
          [
            'High',
            'Large codebase with extensive testing',
            'Multiple CI/CD stages',
          ],
        ],
      })
    ).toEqual({
      overview: ['CI/CD configuration files are present.'],
      entryPoints: undefined,
      importantFiles: undefined,
      architecture: undefined,
      featureSignals: undefined,
      complexity: [
        'High',
        'Large codebase with extensive testing',
        'Multiple CI/CD stages',
      ],
    })
  })
})
