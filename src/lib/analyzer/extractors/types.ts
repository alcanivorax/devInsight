interface TreeInfo {
  language: string | null;
  framework: string | null;
  hasDocker: boolean;
  hasCI: boolean;
  hasTests: boolean;
  entryPoint: string | null;
}

interface DetectionPatterns {
  configFiles: Map<string, { language?: string; framework?: string }>;
  testPatterns: RegExp[];
  ciPatterns: RegExp[];
  dockerPatterns: RegExp[];
  entryPoints: Map<string, string[]>;
}

interface ReadmeInfo {
  title: string | null;
  description: string | null;
  installation: string | null;
}

interface PackageInfo {
  name: string | null;
  version: string | null;
  description: string | null;
  language: string;
  framework: string | null;
  runtime: string | null;
  packageManager: string | null;
  scripts: {
    dev: string | null;
    build: string | null;
    start: string | null;
    test: string | null;
  };
  dependencies: string[];
  devDependencies: string[];
  entryPoint: string | null;
}

interface FrameworkSignature {
  deps: string[];
  framework: string;
  runtime?: string;
}
export type {
  TreeInfo,
  DetectionPatterns,
  ReadmeInfo,
  PackageInfo,
  FrameworkSignature,
};
