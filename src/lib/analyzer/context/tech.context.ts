import type { TechContext } from "./types";
import type { ResolvedTechInfo } from "../merge/types";

export function createTechContext(resolved: ResolvedTechInfo): TechContext {
  return {
    language: resolved.language,
    framework: resolved.framework,
    runtime: resolved.runtime,
    packageManager: resolved.packageManager,
  };
}
