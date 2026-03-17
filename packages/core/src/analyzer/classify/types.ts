type RepoType = 'library' | 'cli' | 'framework' | 'unknown' | 'app'

interface RepoClassification {
  type: RepoType
  confidence: 'explicit' | 'inferred'
  reasons: string[]
}

export type { RepoClassification, RepoType }
