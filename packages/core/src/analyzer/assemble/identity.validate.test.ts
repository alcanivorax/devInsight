import { describe, expect, it } from 'vitest'
import { validateIdentityOutput } from './identity.validate'

describe('validateIdentityOutput', () => {
  it('treats a bare string as the summary', () => {
    expect(validateIdentityOutput('A repository analyzer.')).toEqual({
      summary: 'A repository analyzer.',
      purpose: null,
      audience: null,
    })
  })
})
