// merge layer output (internal)
interface ResolvedTechInfo {
  language: string | null;
  framework: string | null;
  runtime: string | null;
  packageManager: string | null;
}

export type { ResolvedTechInfo };
