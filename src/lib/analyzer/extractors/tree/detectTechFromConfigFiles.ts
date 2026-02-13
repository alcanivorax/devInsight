import type { TechHints, TechSignal } from "../types";
import { shouldOverride } from "@/helper/shouldOverride";

export function detectTechFromConfigFiles(
  path: string,
  configFiles: Map<string, TechSignal>,
  info: TechHints
): void {
  const fileName = path.split("/").pop()?.toLowerCase() || "";
  const match = configFiles.get(fileName);

  if (!match) return;

  if (match.language && shouldOverride(info.language, match.language)) {
    info.language = match.language;
  }

  if (match.framework && shouldOverride(info.framework, match.framework)) {
    info.framework = match.framework;
  }
}
