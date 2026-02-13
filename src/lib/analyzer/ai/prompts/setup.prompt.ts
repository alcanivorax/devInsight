import type { SetupContext } from '../../context/types'

export function buildSetupPrompt(context: SetupContext): string {
  return `
You are a senior software engineer.

You are given setup-related information extracted from a repository.
Your task is to present installation and run instructions as clearly as possible.

Rules:
- Use ONLY the provided context.
- Do NOT invent setup steps.
- If installation instructions are missing, state that clearly.
- If a run command is provided, present it as a possible way to run the project.
- Do NOT guarantee that the steps will work.
- Output ONLY valid JSON.
- Do NOT include explanations or extra text.

The JSON MUST match this schema exactly:

{
  "installation": string | null,
  "runCommand": string | null
}

Setup Context:
${JSON.stringify(context, null, 2)}
`
}
