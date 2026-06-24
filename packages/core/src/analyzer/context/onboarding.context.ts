import type {
  IdentityContext,
  OnboardingContext,
  SetupContext,
  StructureContext,
  TechContext,
} from './types'

export function createOnboardingContext(input: {
  identity: IdentityContext
  tech: TechContext
  structure: StructureContext
  setup: SetupContext
}): OnboardingContext {
  return {
    identity: input.identity,
    tech: input.tech,
    structure: input.structure,
    setup: input.setup,
  }
}
