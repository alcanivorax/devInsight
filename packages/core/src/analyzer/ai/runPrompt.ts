import { OpenRouter } from '@openrouter/sdk'
import { ChatError } from '@openrouter/sdk/models/errors'
import {
  AppError,
  ExternalServiceError,
  UnauthorizedError,
  ValidationError,
} from '../../error'

export async function runPrompt<T>(prompt: string): Promise<T> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new UnauthorizedError(
      'OpenRouter API key is not configured. Set OPENROUTER_API_KEY.'
    )
  }

  if (!process.env.OPENROUTER_MODEL) {
    throw new ValidationError(
      'OpenRouter model is not configured. Set OPENROUTER_MODEL.'
    )
  }

  const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  })

  const response = await sendPrompt(openrouter, prompt)

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

async function sendPrompt(openrouter: OpenRouter, prompt: string) {
  try {
    return await openrouter.chat.send({
      model: process.env.OPENROUTER_MODEL,
      messages: [{ role: 'user', content: prompt }],
    })
  } catch (error) {
    throw mapOpenRouterError(error)
  }
}

function mapOpenRouterError(error: unknown): Error {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof ChatError) {
    if (error.statusCode === 401 || isOpenRouterAuthError(error.message)) {
      return new UnauthorizedError(
        'OpenRouter authentication failed. Check OPENROUTER_API_KEY.'
      )
    }

    if (error.statusCode === 400) {
      return new ValidationError(
        `OpenRouter rejected the request: ${error.message}`
      )
    }

    if (error.statusCode === 429) {
      return new ExternalServiceError(
        'OpenRouter rate limit exceeded. Try again later.',
        429
      )
    }

    return new ExternalServiceError('OpenRouter request failed.')
  }

  return error instanceof Error
    ? new ExternalServiceError(`OpenRouter request failed: ${error.message}`)
    : new ExternalServiceError('OpenRouter request failed.')
}

function isOpenRouterAuthError(message: string): boolean {
  return /user not found|invalid api key|authentication|unauthorized/i.test(
    message
  )
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
