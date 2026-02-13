import type { TreeSignals } from "../types";
import { createDetectionPatterns } from "./createDetectionPatterns";
import { detectEntryPoint } from "./detectEntryPoint";
import type { RawRepoTree } from "../types";

export function extractTreeSignal(tree: RawRepoTree): TreeSignals {
  const treeSignalInfo: TreeSignals = {
    hasDocker: false,
    hasCI: false,
    hasTests: false,
  };

  const patterns = createDetectionPatterns();
  const normalizedPaths = tree.map((item) => item.path.toLowerCase());

  for (let i = 0; i < tree.length; i++) {
    const normalized = normalizedPaths[i];

    // Detect Docker
    if (
      !treeSignalInfo.hasDocker &&
      patterns.dockerPatterns.some((p) => p.test(normalized))
    ) {
      treeSignalInfo.hasDocker = true;
    }

    // Detect CI/CD
    if (
      !treeSignalInfo.hasCI &&
      patterns.ciPatterns.some((p) => p.test(normalized))
    ) {
      treeSignalInfo.hasCI = true;
    }

    // Detect tests
    if (
      !treeSignalInfo.hasTests &&
      patterns.testPatterns.some((p) => p.test(normalized))
    ) {
      treeSignalInfo.hasTests = true;
    }
  }

  return treeSignalInfo;
}
