import { test, expect } from 'vitest'
import { extractTreeSignal } from './extractTreeSignal'
import { dummyTree } from './__fixtures__/tree'

test('extractTreeInfo detects basic project structure', () => {
  const info = extractTreeSignal(dummyTree)

  expect(info.hasDocker).toBe(true)
  expect(info.hasCI).toBe(true)
  expect(info.hasTests).toBe(true)
})
