import { describe, expect, it } from 'vitest'
import { validateSetupOutput } from './setup.validate'

describe('validateSetupOutput', () => {
  it('treats a bare string as installation guidance', () => {
    expect(validateSetupOutput('Install dependencies with pnpm.')).toEqual({
      installation: 'Install dependencies with pnpm.',
      runCommand: undefined,
      nextSteps: undefined,
    })
  })

  it('treats missing installation instructions as null', () => {
    expect(
      validateSetupOutput({
        runCommand: 'pnpm dev',
        nextSteps: [['pnpm test', 'pnpm lint']],
      })
    ).toEqual({
      installation: null,
      runCommand: 'pnpm dev',
      nextSteps: ['pnpm test', 'pnpm lint'],
    })
  })
})
