import { test, expect } from 'vitest'
import { extractTechHints } from './extractTechHints'
import { dummyTree } from './__fixtures__/tree'

test('extractTechHints detects language and framework from config files', () => {
  const info = extractTechHints(dummyTree)

  expect(info.language).toEqual({
    confidence: 'explicit',
    value: 'TypeScript',
  })

  expect(info.framework).toEqual({
    confidence: 'explicit',
    value: 'Next.js',
  })

  expect(info.language.confidence).not.toBe('inferred')
})
