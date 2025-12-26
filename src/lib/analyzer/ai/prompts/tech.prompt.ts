import { TechContext } from "../../context/types";

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
- Keep the explanation brief and neutral.
- Output ONLY valid JSON.
- Do NOT include explanations or extra text.

The JSON MUST match this schema exactly:

{
  "stack": string
}

Tech Context:
${JSON.stringify(context, null, 2)}
`;
}
