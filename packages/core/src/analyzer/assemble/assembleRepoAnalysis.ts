import type { RepoAnalysis } from './types'
import { runPrompt } from '../ai/runPrompt'
import { validateIdentityOutput } from './identity.validate'
import { validateTechOutput } from './tech.validate'
import { validateStructureOutput } from './structure.validate'
import { validateSetupOutput } from './setup.validate'

export async function assembleRepoAnalysis(prompts: {
  identity: string
  tech: string
  structure: string
  setup: string
}): Promise<RepoAnalysis> {
  const [identityRaw, techRaw, structureRaw, setupRaw] = await Promise.all([
    runPrompt(prompts.identity),
    runPrompt(prompts.tech),
    runPrompt(prompts.structure),
    runPrompt(prompts.setup),
  ])

  return {
    identity: validateIdentityOutput(identityRaw),
    tech: validateTechOutput(techRaw),
    structure: validateStructureOutput(structureRaw),
    setup: validateSetupOutput(setupRaw),
  }
}
