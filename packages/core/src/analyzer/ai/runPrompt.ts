import { OpenRouter } from '@openrouter/sdk'
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
      chatRequest: {
        model: process.env.OPENROUTER_MODEL,
        messages: [{ role: 'user', content: prompt }],
      },
    })
  } catch (error) {
    throw mapOpenRouterError(error)
  }
}

function mapOpenRouterError(error: unknown): Error {
  if (error instanceof AppError) {
    return error
  }
  // Duck-type check since ChatError is no longer exported in 0.13.x
  if (isHttpError(error)) {
    const statusCode = error.statusCode ?? error.status
    if (statusCode === 401 || isOpenRouterAuthError(error.message)) {
      return new UnauthorizedError(
        'OpenRouter authentication failed. Check OPENROUTER_API_KEY.'
      )
    }
    if (statusCode === 400) {
      return new ValidationError(
        `OpenRouter rejected the request: ${error.message}`
      )
    }
    if (statusCode === 429) {
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

function isHttpError(
  error: unknown
): error is { statusCode?: number; status?: number; message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    ('statusCode' in error || 'status' in error)
  )
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

export function extractJson(text: string): string {
  const trimmed = text.trim()
  const fencedJson = extractFencedJson(trimmed)
  if (fencedJson) {
    return fencedJson
  }
  const balancedJson = extractBalancedJson(trimmed)
  return balancedJson ?? trimmed
}

function extractFencedJson(text: string): string | null {
  const fencePattern = /```(?:json)?\s*([\s\S]*?)```/gi
  let match: RegExpExecArray | null
  while ((match = fencePattern.exec(text)) !== null) {
    const candidate = match[1].trim()
    if (isJson(candidate)) {
      return candidate
    }
  }
  return null
}

function extractBalancedJson(text: string): string | null {
  for (let start = 0; start < text.length; start += 1) {
    const char = text[start]
    if (char !== '{' && char !== '[') {
      continue
    }
    const candidate = readBalancedJson(text, start)
    if (candidate && isJson(candidate)) {
      return candidate
    }
  }
  return null
}

function readBalancedJson(text: string, start: number): string | null {
  const stack: string[] = []
  let inString = false
  let escaped = false

  for (let index = start; index < text.length; index += 1) {
    const char = text[index]
    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === '"') {
        inString = false
      }
      continue
    }
    if (char === '"') {
      inString = true
      continue
    }
    if (char === '{') {
      stack.push('}')
      continue
    }
    if (char === '[') {
      stack.push(']')
      continue
    }
    if (char === '}' || char === ']') {
      if (stack.pop() !== char) {
        return null
      }
      if (stack.length === 0) {
        return text.slice(start, index + 1).trim()
      }
    }
  }
  return null
}

function isJson(text: string): boolean {
  try {
    JSON.parse(text)
    return true
  } catch {
    return false
  }
}
