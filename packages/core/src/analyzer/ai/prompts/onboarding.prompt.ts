import type { OnboardingContext } from '../../context/types'

export function buildOnboardingPrompt(context: OnboardingContext): string {
  return `
You are a senior engineer helping another developer understand an unfamiliar repository quickly.

You are given repository identity, technology, structure, and setup context.
Your task is to produce concise onboarding guidance that is useful for a first technical review.

Rules:
- Use ONLY the provided context.
- Prefer concrete paths, scripts, and detected signals over generic advice.
- Do NOT claim the project is production-ready or broken unless the context supports it.
- "startHere" should list the first files or directories to inspect and why.
- "keySignals" should explain the most important evidence about architecture or project shape.
- "gaps" should list missing or uncertain information that limits confidence.
- Prioritize files that reveal contracts, boundaries, data flow, or runtime setup.
- Avoid generic advice such as "read the README" unless paired with a concrete reason from context.
- Keep each item short and actionable.
- Output ONLY valid JSON.
- Do NOT include explanations or extra text.

The JSON MUST match this schema exactly:

{
  "startHere": string[],
  "keySignals": string[],
  "gaps": string[]
}

Onboarding Context:
${JSON.stringify(context, null, 2)}
`
}
