import { getOctokit } from './client'
import { RequestError } from 'octokit'

export async function getRepoReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const res = await getOctokit().rest.repos.getReadme({ owner, repo })

    if (!res.data.content) return null

    return Buffer.from(res.data.content, 'base64').toString('utf-8')
  } catch (err) {
    if (err instanceof RequestError && err.status === 404) return null
    throw err
  }
}
