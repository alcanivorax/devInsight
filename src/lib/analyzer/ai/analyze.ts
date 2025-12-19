import { OpenRouter } from "@openrouter/sdk";
import { RepoAnalysis } from "./types";
import { ValidationError } from "@/lib/error";

export async function aiSummary(prompt: string): Promise<RepoAnalysis> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("Missing OPENROUTER_API_KEY");
  }

  const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  const response = await openrouter.chat.send({
    model: process.env.OPENROUTER_MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.choices[0]?.message?.content;

  if (content == null) {
    throw new ValidationError("Empty AI response");
  }

  const text = extractTextContent(content);
  if (!text) {
    throw new ValidationError("Empty AI response");
  }

  const cleaned = extractJson(text);

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new ValidationError("AI returned invalid JSON", {
      rawOutput: text,
      cleanedOutput: cleaned,
    });
  }

  // Runtime shape validation
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as any).summary !== "string" ||
    typeof (parsed as any).architecture !== "string" ||
    !Array.isArray((parsed as any).setupGuide) ||
    !(parsed as any).setupGuide.every((s: any) => typeof s === "string")
  ) {
    throw new ValidationError(
      "AI response does not match RepoAnalysis contract",
      { parsed }
    );
  }

  return parsed as RepoAnalysis;
}

function extractTextContent(content: string | any[]): string | null {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("");
  }

  return null;
}

function extractJson(text: string): string {
  const trimmed = text.trim();

  // Handle ```json ... ``` or ``` ... ```
  if (trimmed.startsWith("```")) {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return trimmed;
}
