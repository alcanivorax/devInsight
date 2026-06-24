import { describe, expect, it } from 'vitest'
import { validateOnboardingOutput } from './onboarding.validate'

describe('validateOnboardingOutput', () => {
  it('treats a bare string array as startHere guidance', () => {
    expect(validateOnboardingOutput(['package.json', 'src/app'])).toEqual({
      startHere: ['package.json', 'src/app'],
      keySignals: [],
      gaps: [],
    })
  })

  it('defaults omitted onboarding lists to empty arrays', () => {
    expect(
      validateOnboardingOutput({
        startHere: ['package.json'],
      })
    ).toEqual({
      startHere: ['package.json'],
      keySignals: [],
      gaps: [],
    })
  })
})
