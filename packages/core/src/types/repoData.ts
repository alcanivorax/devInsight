import type {
  getRepoMetadata,
  getRepoReadme,
  getRepoTree,
  getRepoPackageJson,
} from '../github'

export type RepoData = {
  readme: Awaited<ReturnType<typeof getRepoReadme>>
  pkg: Awaited<ReturnType<typeof getRepoPackageJson>>
  tree: Awaited<ReturnType<typeof getRepoTree>>
  metadata: Awaited<ReturnType<typeof getRepoMetadata>>
}
