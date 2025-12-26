import { DetectionPatterns, RawRepoTree, TechHints } from "../types";
import { createDetectionPatterns } from "./createDetectionPatterns";
import { detectTechFromConfigFiles } from "./detectTechFromConfigFiles";

export function extractTechHints(tree: RawRepoTree): TechHints {
  const techHintsInfo: TechHints = {
    language: { value: null, confidence: "unknown" },
    framework: { value: null, confidence: "unknown" },
  };

  const patterns: DetectionPatterns = createDetectionPatterns();

  for (let i = 0; i < tree.length; i++) {
    const path = tree[i].path.toLowerCase();
    detectTechFromConfigFiles(path, patterns.configFiles, techHintsInfo);
  }

  return techHintsInfo;
}
