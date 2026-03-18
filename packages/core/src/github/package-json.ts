import { octokit } from './client'
import { RequestError } from 'octokit'
import type { RawPackageJson } from './types'

export async function getRepoPackageJson(
  owner: string,
  repo: string
): Promise<RawPackageJson | null> {
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: 'package.json',
    })

    if ('content' in res.data) {
      const decoded = Buffer.from(res.data.content, 'base64').toString('utf-8')
      return JSON.parse(decoded)
    }

    return null
  } catch (err: unknown) {
    if (err instanceof RequestError && err.status === 404) return null
    throw err
  }
}
