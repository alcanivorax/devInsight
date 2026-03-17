import { OpenRouter } from '@openrouter/sdk'
import { ValidationError } from '../../error'

export async function runPrompt<T>(prompt: string): Promise<T> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('Missing OPENROUTER_API_KEY')
  }

  const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  })

  const response = await openrouter.chat.send({
    model: process.env.OPENROUTER_MODEL,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = response.choices[0]?.message?.content

  if (content == null) {
    throw new ValidationError('Empty AI response')
  }

  const text = extractTextContent(content)
  if (!text) {
    throw new ValidationError('Empty AI response')
  }

  const cleaned = extractJson(text)

  try {
    return JSON.parse(cleaned) as T
  } catch {
    throw new ValidationError('AI returned invalid JSON', {
      rawOutput: text,
      cleanedOutput: cleaned,
    })
  }
}

function extractTextContent(content: string | unknown[]): string | null {
  if (typeof content === 'string') {
    return content
  }

  if (Array.isArray(content)) {
    return content
      .filter(
        (item): item is { type: 'text'; text: string } =>
          typeof item === 'object' &&
          item !== null &&
          (item as Record<string, unknown>).type === 'text'
      )
      .map((item) => item.text)
      .join('')
  }

  return null
}

function extractJson(text: string): string {
  const trimmed = text.trim()

  // Strip ONLY the outer ``` fence if present
  if (trimmed.startsWith('```')) {
    const lines = trimmed.split('\n')

    // Remove opening fence (``` or ```json)
    lines.shift()

    // Remove closing fence (```)
    if (lines[lines.length - 1].trim() === '```') {
      lines.pop()
    }

    return lines.join('\n').trim()
  }

  return trimmed
}
