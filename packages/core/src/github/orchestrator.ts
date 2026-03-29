import { parseGitHubRepoUrl } from '../utils'
import {
  getRepoReadme,
  getRepoMetadata,
  getRepoTree,
  getRepoPackageJson,
} from './index'
import type { RepoData } from '../types/repoData'

export async function getRepoData(repoUrl: string): Promise<RepoData> {
  const { owner, repo } = parseGitHubRepoUrl(repoUrl)

  const metadata = await getRepoMetadata(owner, repo)
  if (!metadata) {
    throw new Error('Metadata is null')
  }

  const [readme, pkg, tree] = await Promise.all([
    getRepoReadme(owner, repo),
    getRepoPackageJson(owner, repo),
    getRepoTree(owner, repo, metadata.defaultBranch),
  ])

  return { readme, pkg, tree, metadata }
}
