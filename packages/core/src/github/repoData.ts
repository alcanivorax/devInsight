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
  const [readme, pkg, tree, metadata] = await Promise.all([
    getRepoReadme(owner, repo),
    getRepoPackageJson(owner, repo),
    getRepoTree(owner, repo),
    getRepoMetadata(owner, repo),
  ])
  return { readme, pkg, tree, metadata }
}
