import type { RepoAnalysis } from "./types";
import { runPrompt } from "@/lib/analyzer/ai/runPrompt";
import { validateIdentityOutput } from "./identity.validate";
import { validateTechOutput } from "./tech.validate";
import { validateStructureOutput } from "./structure.validate";
import { validateSetupOutput } from "./setup.validate";

export async function assembleRepoAnalysis(prompts: {
  identity: string;
  tech: string;
  structure: string;
  setup: string;
}): Promise<RepoAnalysis> {
  const identityRaw = await runPrompt(prompts.identity);
  const techRaw = await runPrompt(prompts.tech);
  const structureRaw = await runPrompt(prompts.structure);
  const setupRaw = await runPrompt(prompts.setup);

  return {
    identity: validateIdentityOutput(identityRaw),
    tech: validateTechOutput(techRaw),
    structure: validateStructureOutput(structureRaw),
    setup: validateSetupOutput(setupRaw),
  };
}
