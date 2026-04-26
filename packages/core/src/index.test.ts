import { describe, expect, it } from 'vitest'
import { parseRepoInput } from './index'

describe('@devinsight/core root export', () => {
  it('does not require GITHUB_TOKEN for non-GitHub utilities', () => {
    const originalToken = process.env.GITHUB_TOKEN
    delete process.env.GITHUB_TOKEN

    try {
      expect(parseRepoInput('openai/codex')).toEqual({
        owner: 'openai',
        repo: 'codex',
      })
    } finally {
      if (originalToken === undefined) {
        delete process.env.GITHUB_TOKEN
      } else {
        process.env.GITHUB_TOKEN = originalToken
      }
    }
  })
})
