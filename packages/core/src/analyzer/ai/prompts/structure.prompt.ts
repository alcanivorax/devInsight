import type { StructureContext } from '../../context/types'

export function buildStructurePrompt(context: StructureContext): string {
  return `
You are a senior software engineer.

You are given structural signals extracted from a repository.
Do NOT assume runtime behavior or execution details.

Rules:
- Use ONLY the provided context.
- Do NOT infer technologies, frameworks, or entry points beyond what is listed.
- If multiple entry points exist, acknowledge ambiguity.
- If none exist, state that clearly.
- Do NOT invent explanations.
- Use top-level directories, directory roles, important files, feature signals, complexity indicators, counts, and architectural signals when present.
- Mention concrete paths when they explain where important work happens.
- Prefer repository-specific facts over general framework descriptions.
- Output ONLY valid JSON.
- The JSON MUST match this schema exactly:

{
  "overview": string[],
  "entryPoints": string[] | null,
  "importantFiles": string[],
  "architecture": string[],
  "featureSignals": string[],
  "complexity": string[]
}

Structure Context:
${JSON.stringify(context, null, 2)}
`
}
