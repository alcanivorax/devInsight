import type { IdentityContext } from '../../context/types'

export function buildIdentityPrompt(context: IdentityContext): string {
  return `
You are a senior software engineer.

You are given basic identity information about a GitHub repository.
Your task is to write a concise, neutral summary of what the repository is.

Rules:
- Use ONLY the provided context.
- Do NOT mention setup steps.
- Do NOT assume functionality beyond the description.
- If information is missing, state that clearly.
- Be factual and restrained.
- Prefer specific purpose and audience when topics/description support them.
- Output ONLY valid JSON.
- Do NOT include explanations or extra text.

The JSON MUST match this schema exactly:

{
  "summary": string,
  "purpose": string | null,
  "audience": string | null
}

Identity Context:
${JSON.stringify(context, null, 2)}
`
}
