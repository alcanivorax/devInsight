import { describe, it, expect } from 'vitest'
import { extractReadmeInfo } from './extractReadmeInfo'
import { dummyReadme } from './__fixtures__/readme'

describe('extractReadmeInfo (smoke test)', () => {
  it('extractReadmeInfo extracting value correctly', async () => {
    const result = await extractReadmeInfo(dummyReadme)

    expect(result.title).toBe('DevInsight Sample Repo')
    expect(result.description).toBe(
      'A tool that analyzes GitHub repositories and generates structured insights.'
    )
  })
})
