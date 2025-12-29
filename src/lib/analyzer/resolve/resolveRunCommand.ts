import { PackageInfo } from "../extractors/types";
export function resolveRunCommand(pkg: PackageInfo): string | null {
  return pkg.scripts.dev ?? pkg.scripts.start ?? null;
}
