import type {
  IdentityContext,
  OnboardingContext,
  SetupContext,
  StructureContext,
  TechContext,
} from '../context/types'
import type { RepoAnalysis } from './types'

export function createFallbackRepoAnalysis(context: {
  identity: IdentityContext
  tech: TechContext
  structure: StructureContext
  setup: SetupContext
  onboarding: OnboardingContext
}): RepoAnalysis {
  return {
    identity: {
      summary: buildIdentitySummary(context.identity),
      purpose: context.identity.description,
      audience: null,
    },
    tech: {
      stack: buildStackSummary(context.tech),
      notableLibraries: buildNotableLibraries(context.tech),
      dependencyInsights: context.tech.dependencyInsights
        ?.slice(0, 8)
        .map((item) => `${item.name}: ${item.reason}`),
    },
    structure: {
      overview: context.structure.overview,
      entryPoints: context.structure.entryPoints?.map((item) => item.value),
      importantFiles: context.structure.importantFiles
        ?.slice(0, 12)
        .map((item) => `${item.path}: ${item.reason}`),
      architecture: [
        ...(context.structure.architecturalSignals ?? []),
        ...(context.structure.directoryRoles
          ?.slice(0, 8)
          .map((item) => `${item.path}: ${item.role}`) ?? []),
      ],
      featureSignals: context.structure.featureSignals
        ?.slice(0, 8)
        .map((item) => `${item.name}: ${item.evidence.join(', ')}`),
      complexity: [
        ...(context.structure.complexityIndicators?.map(
          (item) => `${item.label}: ${item.detail}`
        ) ?? []),
        ...(context.structure.counts
          ? [
              `${context.structure.counts.files} files, ${context.structure.counts.directories} directories, ${context.structure.counts.testFiles} test files, ${context.structure.counts.configFiles} config files.`,
            ]
          : []),
      ],
    },
    setup: {
      installation: context.setup.installation,
      runCommand: context.setup.runCommand,
      nextSteps: buildSetupNextSteps(context.setup),
    },
    onboarding: {
      startHere: buildStartHere(context.onboarding),
      keySignals: buildKeySignals(context.onboarding),
      gaps: buildGaps(context.onboarding),
    },
  }
}

function buildIdentitySummary(context: IdentityContext): string {
  if (context.description) {
    return context.description
  }
  const name = context.name ?? 'This repository'
  return `${name} has limited README or metadata description available; the analysis is based on extracted repository signals.`
}

function buildStackSummary(context: TechContext): string {
  const parts = [
    context.language,
    context.framework,
    context.runtime,
    context.packageManager,
  ].filter((item): item is string => Boolean(item))

  return parts.length > 0
    ? parts.join(', ')
    : 'No explicit language, framework, runtime, or package manager was resolved from the provided context.'
}

function buildNotableLibraries(context: TechContext): string[] | undefined {
  const libraries = [
    ...(context.dependencyInsights?.map((item) => item.name) ?? []),
    ...(context.dependencies ?? []),
  ]
  const uniqueLibraries = [...new Set(libraries)].slice(0, 12)
  return uniqueLibraries.length > 0 ? uniqueLibraries : undefined
}

function buildSetupNextSteps(context: SetupContext): string[] {
  const steps: string[] = []
  if (context.packageManager) {
    steps.push(`Install dependencies with ${context.packageManager}.`)
  }
  if (context.scripts?.test)
    steps.push('Run the test script from package.json.')
  if (context.scripts?.lint)
    steps.push('Run the lint script from package.json.')
  if (context.scripts?.checkTypes) {
    steps.push('Run the typecheck script from package.json.')
  }
  if (context.scripts?.format) {
    steps.push('Run the format script from package.json.')
  }
  return steps
}

function buildStartHere(context: OnboardingContext): string[] {
  const files = context.structure.importantFiles
    ?.slice(0, 6)
    .map((item) => `${item.path}: ${item.reason}`)

  if (files && files.length > 0) {
    return files
  }
  return [
    'package.json: review scripts, dependencies, and package manager metadata.',
    'README.md: review available project description and setup guidance.',
  ]
}

function buildKeySignals(context: OnboardingContext): string[] {
  const signals = [
    ...context.structure.overview,
    buildStackSummary(context.tech),
  ].filter(Boolean)

  return signals.length > 0
    ? signals
    : ['Only limited repository signals were available for analysis.']
}

function buildGaps(context: OnboardingContext): string[] {
  const gaps: string[] = []
  if (!context.identity.description) {
    gaps.push('Repository metadata or README description is missing.')
  }
  if (!context.setup.installation) {
    gaps.push('Installation instructions were not clearly extracted.')
  }
  if (!context.setup.runCommand) {
    gaps.push('A run command was not confidently resolved.')
  }
  return gaps
}
