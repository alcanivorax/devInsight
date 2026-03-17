import { repoInputSchema } from '../schemas/repoInput.schema'
import { parseGitHubRepoUrl } from './parseGithubRepoUrl'

export function parseRepoInput(input: string) {
  const value = repoInputSchema.parse(input)

  if (value.includes('github.com')) {
    return parseGitHubRepoUrl(value)
  }

  const [owner, repo] = value.split('/')
  return { owner, repo }
}
