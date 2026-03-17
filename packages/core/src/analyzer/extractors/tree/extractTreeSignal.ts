import type { TreeSignals, RawRepoTree } from '../types'
import { createDetectionPatterns } from './createDetectionPatterns'

export function extractTreeSignal(tree: RawRepoTree): TreeSignals {
  const treeSignalInfo: TreeSignals = {
    hasDocker: false,
    hasCI: false,
    hasTests: false,
  }

  const patterns = createDetectionPatterns()
  const normalizedPaths = tree.map((item) => item.path.toLowerCase())

  for (let i = 0; i < tree.length; i++) {
    const normalized = normalizedPaths[i]

    if (
      !treeSignalInfo.hasDocker &&
      patterns.dockerPatterns.some((p) => p.test(normalized))
    ) {
      treeSignalInfo.hasDocker = true
    }

    if (
      !treeSignalInfo.hasCI &&
      patterns.ciPatterns.some((p) => p.test(normalized))
    ) {
      treeSignalInfo.hasCI = true
    }

    if (
      !treeSignalInfo.hasTests &&
      patterns.testPatterns.some((p) => p.test(normalized))
    ) {
      treeSignalInfo.hasTests = true
    }
  }

  return treeSignalInfo
}
