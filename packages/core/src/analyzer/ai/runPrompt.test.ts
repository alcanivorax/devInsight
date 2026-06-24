import { describe, expect, it } from 'vitest'
import { extractJson } from './runPrompt'

describe('extractJson', () => {
  it('returns plain JSON unchanged', () => {
    expect(extractJson('{"name":"devinsight"}')).toBe('{"name":"devinsight"}')
  })

  it('extracts JSON from a fenced code block', () => {
    expect(
      extractJson('```json\n{"name":"devinsight","valid":true}\n```')
    ).toBe('{"name":"devinsight","valid":true}')
  })

  it('extracts JSON when the model includes surrounding prose', () => {
    expect(extractJson('Here is the JSON:\n{"name":"devinsight"}\nDone.')).toBe(
      '{"name":"devinsight"}'
    )
  })

  it('handles nested arrays and braces inside strings', () => {
    expect(
      extractJson(
        'Result:\n{"items":[{"path":"src/app/page.tsx","note":"uses { braces } in copy"}]}'
      )
    ).toBe(
      '{"items":[{"path":"src/app/page.tsx","note":"uses { braces } in copy"}]}'
    )
  })

  it('skips non-json brackets before the actual JSON document', () => {
    expect(extractJson('[draft] {"name":"devinsight"}')).toBe(
      '{"name":"devinsight"}'
    )
  })
})
