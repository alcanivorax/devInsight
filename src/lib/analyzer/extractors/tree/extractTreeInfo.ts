import { TreeInfo } from "../types";
import { detectFromConfigFiles } from "./detectFromConfigFiles";
import { createDetectionPatterns } from "./createDetectionPatterns";
import { detectEntryPoint } from "./detectEntryPoint";
import { RawRepoTree } from "../types";

export function extractTreeInfo(tree: RawRepoTree): TreeInfo {
  const info: TreeInfo = {
    language: null,
    framework: null,
    hasDocker: false,
    hasCI: false,
    hasTests: false,
    entryPoint: null,
  };

  const patterns = createDetectionPatterns();
  const normalizedPaths = tree.map((item) => item.path.toLowerCase());

  for (let i = 0; i < tree.length; i++) {
    const path = tree[i].path;
    const normalized = normalizedPaths[i];

    // Detect language and framework from config files
    detectFromConfigFiles(path, normalized, patterns.configFiles, info);

    // Detect Docker
    if (
      !info.hasDocker &&
      patterns.dockerPatterns.some((p) => p.test(normalized))
    ) {
      info.hasDocker = true;
    }

    // Detect CI/CD
    if (!info.hasCI && patterns.ciPatterns.some((p) => p.test(normalized))) {
      info.hasCI = true;
    }

    // Detect tests
    if (
      !info.hasTests &&
      patterns.testPatterns.some((p) => p.test(normalized))
    ) {
      info.hasTests = true;
    }

    // Detect entry point
    if (!info.entryPoint && info.language) {
      const entryPoint = detectEntryPoint(
        path,
        info.language,
        patterns.entryPoints
      );
      if (entryPoint) info.entryPoint = entryPoint;
    }
  }

  return info;
}
