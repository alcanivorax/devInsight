export function detectPackageManager(pkg: any): string | null {
  // Check for lockfile indicators (if available in the parsed object)
  if (pkg.packageManager) {
    if (pkg.packageManager.startsWith("pnpm")) return "pnpm";
    if (pkg.packageManager.startsWith("yarn")) return "yarn";
    if (pkg.packageManager.startsWith("bun")) return "bun";
    if (pkg.packageManager.startsWith("npm")) return "npm";
  }

  // Check for workspace indicators
  if (pkg.workspaces) return "npm"; // or could be yarn/pnpm
  if (pkg.pnpm) return "pnpm";

  return null; // Can't determine from package.json alone
}
