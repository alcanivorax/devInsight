import type {
  IdentityContext,
  RepoContext,
  SetupContext,
  StructureContext,
  TechContext,
} from "./types";

export function createRepoContext(
  identity: IdentityContext,
  tech: TechContext,
  structure: StructureContext,
  setup: SetupContext
): RepoContext {
  return {
    identity,
    tech,
    structure,
    setup,
  };
}
