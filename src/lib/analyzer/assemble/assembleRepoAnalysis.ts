import { RepoAnalysis } from "./types";
import { runPrompt } from "@/lib/analyzer/ai/runPrompt";

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
