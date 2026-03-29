import { octokit } from './client'
import { RequestError } from 'octokit'
import type { RawLanguages } from './types'

export async function getRepoLanguage(
  owner: string,
  repo: string
): Promise<RawLanguages | null> {
  try {
    const res = await octokit.rest.repos.listLanguages({
      owner,
      repo,
    })
    return res.data
  } catch (err) {
    if (err instanceof RequestError && err.status === 404) return null
    throw err
  }
}
