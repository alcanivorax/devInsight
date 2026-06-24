import { Octokit, RequestError } from 'octokit'

let authenticatedOctokit: Octokit | null = null
let publicOctokit: Octokit | null = null

export function getOctokit(): Octokit {
  if (!process.env.GITHUB_TOKEN) {
    return getPublicOctokit()
  }

  authenticatedOctokit ??= new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  return authenticatedOctokit
}

export function getPublicOctokit(): Octokit {
  publicOctokit ??= new Octokit()
  return publicOctokit
}

export async function withGitHubAuthFallback<T>(
  request: (octokit: Octokit) => Promise<T>
): Promise<T> {
  try {
    return await request(getOctokit())
  } catch (error) {
    if (process.env.GITHUB_TOKEN && isBadCredentialsError(error)) {
      return request(getPublicOctokit())
    }
    throw error
  }
}

function isBadCredentialsError(error: unknown): boolean {
  return (
    error instanceof RequestError &&
    error.status === 401 &&
    /bad credentials/i.test(error.message)
  )
}
