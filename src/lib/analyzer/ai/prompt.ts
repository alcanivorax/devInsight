import { RepoContext } from "../context/types";
export function buildRepoAnalysisPrompt(context: RepoContext): string {
  return `
You are a senior software engineer.

You are given structured information about a GitHub repository.
Do NOT assume anything beyond the provided data.

Your tasks:
1. Explain what the repository does.
2. Describe its high-level architecture.
3. Provide a practical setup guide.

Rules:
- Use ONLY the provided context.
- If information is missing, say so clearly.
- Do NOT invent features, technologies, or details.
- Output ONLY valid JSON.
- Do NOT include explanations, markdown, or extra text.
- The JSON MUST match this schema exactly:

{
  "summary": string,
  "architecture": string,
  "setupGuide": string[]
}

Repository Context:
${JSON.stringify(context, null, 2)}
`;
}
