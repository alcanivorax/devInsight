import { githubRepoUrlSchema } from '../schemas/githubRepoUrl.schema'

export function parseGitHubRepoUrl(url: string) {
  const parsed = githubRepoUrlSchema.parse(url)
  const { pathname } = new URL(parsed)

  const [owner, repo] = pathname
    .replace(/\.git$/, '')
    .split('/')
    .filter(Boolean)

  return { owner, repo }
}
