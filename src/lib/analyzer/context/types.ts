import { RepoType } from "../classify/types";

// Influenced by: extractReadmeInfo + extractMetadataInfo
interface IdentityContext {
  name: string | null;
  description: string | null;
  repoType?: RepoType;
}

// Influenced by: extractPackageInfo
interface TechContext {
  language: string | null;
  framework: string | null;
  runtime: string | null;
  packageManager: string | null;
}

// Influenced by: extractTreeInfo (+ defaultBranch internally)
interface StructureContext {
  overview: string[];
  entryPoints?: {
    kind: "cli" | "library";
    value: string;
  }[];
}

// Influenced by: extractReadmeInfo + extractPackageInfo
interface SetupContext {
  installation: string | null;
  runCommand: string | null;
}

interface RepoContext {
  identity: IdentityContext;
  tech: TechContext;
  structure: StructureContext;
  setup: SetupContext;
}

export type {
  IdentityContext,
  TechContext,
  StructureContext,
  SetupContext,
  RepoContext,
};
