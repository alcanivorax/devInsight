import type { TechContext } from '../../context/types'

export function buildTechPrompt(context: TechContext): string {
  return `
You are a senior software engineer.

You are given resolved technical information about a repository.
Your task is to explain the technology stack in a clear, factual way.

Rules:
- Use ONLY the provided context.
- Do NOT guess missing technologies.
- If a value is null, state that it is not explicitly specified.
- Do NOT describe architecture or setup steps.
- Use dependencyInsights first when explaining important libraries.
- Mention package scripts only when they clarify developer workflow.
- Keep the explanation brief, concrete, and neutral.
- Avoid listing every dependency; explain what the important dependencies imply.
- Output ONLY valid JSON.
- Do NOT include explanations or extra text.
- "stack" MUST be a single string, not an array or object.
- "notableLibraries" and "dependencyInsights" MUST be arrays of strings.

The JSON MUST match this schema exactly:

{
  "stack": string,
  "notableLibraries": string[],
  "dependencyInsights": string[]
}

Tech Context:
${JSON.stringify(context, null, 2)}
`
}
