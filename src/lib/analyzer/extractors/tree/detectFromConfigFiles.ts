import { TreeInfo } from "../types";

export function detectFromConfigFiles(
  path: string,
  normalized: string,
  configFiles: Map<string, { language?: string; framework?: string }>,
  info: TreeInfo
): void {
  const fileName = path.split("/").pop()?.toLowerCase() || "";
  const match = configFiles.get(fileName);

  if (match) {
    if (!info.language && match.language) {
      info.language = match.language;
    }
    if (!info.framework && match.framework) {
      info.framework = match.framework;
    }
  }

  // Special case: detect framework from package.json content would require reading file
  // For now, we can infer from directory structure
  if (normalized.includes("node_modules")) return;
}
