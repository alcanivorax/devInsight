import { StructureContext } from "../../context/types";

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
- Output ONLY valid JSON.
- The JSON MUST match this schema exactly:

{
  "overview": string[],
  "entryPoints": string[] | null
}

Structure Context:
${JSON.stringify(context, null, 2)}
`;
}
