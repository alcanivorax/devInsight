import { TechHints } from "../extractors/types";
import { PackageInfo } from "../extractors/types";
import { ResolvedTechInfo } from "./types";

function resolveValue(
  hint?: {
    value: string | null;
    confidence: "explicit" | "inferred" | "unknown";
  },
  pkgValue?: string | null
): string | null {
  if (hint?.confidence === "explicit") return hint.value ?? null;
  if (pkgValue) return pkgValue;
  if (hint?.confidence === "inferred") return hint.value ?? null;
  return null;
}

export function mergeTechHintsWithPackageInfo(
  techHints: TechHints,
  packageInfo: PackageInfo
): ResolvedTechInfo {
  return {
    language: resolveValue(techHints.language, packageInfo.language),
    framework: resolveValue(techHints.framework, packageInfo.framework),
    runtime: packageInfo.runtime ?? null,
    packageManager: packageInfo.packageManager ?? null,
  };
}
