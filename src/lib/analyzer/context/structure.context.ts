import type { TreeSignals } from "../extractors/types";
import type { StructuralEntryPoint } from "../resolve/resolveStructuralEntryPoints";
import type { StructureContext } from "./types";

export function createStructureContext(
  tree: TreeSignals,
  entryPoints: StructuralEntryPoint[]
): StructureContext {
  const overview: string[] = [];

  if (tree.hasDocker) overview.push("Docker configuration is present.");
  if (tree.hasCI) overview.push("CI/CD configuration files are present.");
  if (tree.hasTests)
    overview.push("Test-related files or directories are present.");

  if (overview.length === 0) {
    overview.push(
      "No strong structural signals could be inferred from the repository tree."
    );
  }

  return {
    overview,
    entryPoints: entryPoints.length > 0 ? entryPoints : undefined,
  };
}
