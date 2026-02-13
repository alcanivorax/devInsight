import type { ReadmeInfo } from "../types";
import { extractTitle } from "./extractTitle";
import { extractSection } from "./extractSection";
import { extractIntroParagraph } from "./extractIntroParagraph";
import { extractCompositeSection } from "./extractCompositeSection";
import { isMeaningfulDescription } from "@/helper/meaningfulDescription";

export async function extractReadmeInfo(readme: string): Promise<ReadmeInfo> {
  // Normalize line endings and trim
  const normalizedReadme = readme.replace(/\r\n/g, "\n").trim();

  // Extract title (first h1 heading)
  const title = extractTitle(normalizedReadme);

  // Extract description section or fallback first paragraph only after title
  const rawDescription =
    extractSection(normalizedReadme, [
      "about",
      "overview",
      "introduction",
      "description",
      "what is this",
      "why",
    ]) ?? extractIntroParagraph(normalizedReadme);

  const description =
    rawDescription && isMeaningfulDescription(rawDescription)
      ? rawDescription
      : null;

  // Extract installation section
  const installation = extractCompositeSection(normalizedReadme, {
    headers: [
      "installation",
      "install",
      "setup",
      "getting started",
      "prerequisites",
      "running locally",
    ],
    mustIncludeAny: [
      /git\s+clone/i,
      /(npm|pnpm|yarn)\s+install/i,
      /(npm|pnpm|yarn)\s+(dev|start)/i,
    ],
  });

  return { title, description, installation, raw: normalizedReadme };
}
