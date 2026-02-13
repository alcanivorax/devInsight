import type { PackageInfo, TreeSignals, ReadmeInfo } from "../extractors/types";
import type { RepoClassification } from "./types";

export function classifyRepoType(input: {
  packageInfo: PackageInfo | null;
  treeSignals: TreeSignals;
  readme: ReadmeInfo | null;
}): RepoClassification {
  const reasons: string[] = [];

  const pkg = input.packageInfo;
  const readmeText = input.readme?.raw?.toLowerCase() ?? "";

  /* =========================
     1️⃣ CLI detection (strong)
     ========================= */

  if (pkg?.bin && Object.keys(pkg.bin).length > 0) {
    reasons.push("package.json defines a bin field");
    return {
      type: "cli",
      confidence: "explicit",
      reasons,
    };
  }

  if (/npm\s+install\s+-g/.test(readmeText)) {
    reasons.push("README shows global npm installation");
    return {
      type: "cli",
      confidence: "inferred",
      reasons,
    };
  }

  if (/usage:\s+\w+/.test(readmeText) || /\$\s+\w+\s+--help/.test(readmeText)) {
    reasons.push("README shows command-style usage examples");
    return {
      type: "cli",
      confidence: "inferred",
      reasons,
    };
  }

  /* =========================
   2️⃣ App detection
   ========================= */

  const hasStartScript = pkg?.scripts?.start || pkg?.scripts?.dev;

  const hasAppFrameworkDep =
    pkg &&
    ["next", "nuxt", "@angular/core", "vue", "svelte"].some(
      (dep) =>
        pkg.dependencies.includes(dep) || pkg.devDependencies.includes(dep)
    );

  if (hasStartScript && hasAppFrameworkDep) {
    reasons.push("has runnable start/dev script");
    reasons.push("uses an application framework");

    return {
      type: "app",
      confidence: "inferred",
      reasons,
    };
  }

  /* =========================
     3 Framework detection (conservative)
     ========================= */

  const frameworkDeps = [
    "next",
    "nuxt",
    "@angular/core",
    "vue",
    "svelte",
    "solid-js",
  ];

  const hasFrameworkDep =
    pkg &&
    frameworkDeps.some(
      (dep) =>
        pkg.dependencies.includes(dep) || pkg.devDependencies.includes(dep)
    );

  if (hasFrameworkDep) {
    if (/framework/i.test(readmeText)) {
      reasons.push("README explicitly describes the project as a framework");
      return {
        type: "framework",
        confidence: "explicit",
        reasons,
      };
    }

    // Otherwise: DO NOT classify as framework
  }

  /* =========================
     4 Library detection (safe default)
     ========================= */

  if (pkg) {
    reasons.push("published package without CLI or framework signals");
    return {
      type: "library",
      confidence: "inferred",
      reasons,
    };
  }

  /* =========================
     5 Unknown fallback
     ========================= */

  return {
    type: "unknown",
    confidence: "inferred",
    reasons: ["insufficient signals to classify repository"],
  };
}
