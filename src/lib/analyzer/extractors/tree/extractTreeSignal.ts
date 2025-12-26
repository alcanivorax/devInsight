import { TreeSignals } from "../types";
import { createDetectionPatterns } from "./createDetectionPatterns";
import { detectEntryPoint } from "./detectEntryPoint";
import { RawRepoTree } from "../types";

export function extractTreeSignal(tree: RawRepoTree): TreeSignals {
  const treeSignalInfo: TreeSignals = {
    hasDocker: false,
    hasCI: false,
    hasTests: false,
    entryPoints: [],
  };

  const patterns = createDetectionPatterns();
  const normalizedPaths = tree.map((item) => item.path.toLowerCase());

  for (let i = 0; i < tree.length; i++) {
    const path = tree[i].path;
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

    // Detect entry point
    const entryPoint = detectEntryPoint(path, patterns.entryPointPatterns);

    if (
      entryPoint &&
      !treeSignalInfo.entryPoints.some((e) => e.value === entryPoint.value)
    ) {
      treeSignalInfo.entryPoints.push(entryPoint);
    }
  }

  return treeSignalInfo;
}
