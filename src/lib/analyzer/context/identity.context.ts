import type { RepoClassification } from '../classify/types'
import type { MetadataInfo, ReadmeInfo } from '../extractors/types'
import type { IdentityContext } from './types'

export function createIdentityContext(
  readme: ReadmeInfo,
  metadata: MetadataInfo,
  classification: RepoClassification
): IdentityContext {
  const name = readme.title ?? metadata.name ?? null
  const description = readme.description ?? metadata.description ?? null

  return {
    name,
    description,
    repoType: classification.type,
  }
}
