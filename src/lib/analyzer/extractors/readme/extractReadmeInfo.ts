import { ReadmeInfo } from "../types";
import { extractTitle } from "./extractTitle";
import { extractSection } from "./extractSection";
import { extractIntroParagraph } from "./extractIntroParagraph";

export async function extractReadmeInfo(readme: string): Promise<ReadmeInfo> {
  // Normalize line endings and trim
  const normalized = readme.replace(/\r\n/g, "\n").trim();

  // Extract title (first h1 heading)
  const title = extractTitle(normalized);

  // Extract description section or fallback first paragraph only after title
  const description =
    extractSection(normalized, [
      "about",
      "overview",
      "introduction",
      "description",
      "what is this",
      "why",
    ]) ?? extractIntroParagraph(normalized);

  // Extract installation section
  const installation = extractSection(normalized, [
    "installation",
    "install",
    "setup",
    "getting started",
    "get started",
  ]);

  return { title, description, installation };
}
