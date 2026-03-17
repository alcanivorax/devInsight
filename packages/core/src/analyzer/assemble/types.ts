export interface RepoAnalysis {
  identity: {
    summary: string
  }

  tech: {
    stack: string
  }

  structure: {
    overview: string[]
    entryPoints?: string[]
  }

  setup: {
    installation: string | null
    runCommand?: string | null
  }
}
