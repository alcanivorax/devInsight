import { TechContext } from "./types";
import { PackageInfo } from "../extractors/types";

export function createTechContext(packageJson: PackageInfo): TechContext {
  const language = packageJson.language ?? null;
  const framework = packageJson.framework ?? null;
  const packageManager = packageJson.packageManager ?? null;
  const runtime = packageJson.runtime ?? null;

  return {
    language,
    framework,
    packageManager,
    runtime,
  };
}
