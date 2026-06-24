export interface RepoAnalysis {
  identity: {
    summary: string
    purpose?: string | null
    audience?: string | null
  }

  tech: {
    stack: string
    notableLibraries?: string[]
  }

  structure: {
    overview: string[]
    entryPoints?: string[]
    importantFiles?: string[]
    architecture?: string[]
  }

  setup: {
    installation: string | null
    runCommand?: string | null
    nextSteps?: string[]
  }

  onboarding?: {
    startHere: string[]
    keySignals: string[]
    gaps: string[]
  }
}
