import { getOctokit } from './client'
import { RequestError } from 'octokit'
import { packageJsonSchema, type RawPackageJson } from './types'

export async function getRepoPackageJson(
  owner: string,
  repo: string
): Promise<RawPackageJson | null> {
  try {
    const res = await getOctokit().rest.repos.getContent({
      owner,
      repo,
      path: 'package.json',
    })

    if ('content' in res.data) {
      const decoded = Buffer.from(res.data.content, 'base64').toString('utf-8')
      const parsed = JSON.parse(decoded)
      return packageJsonSchema.parse(parsed)
    }

    return null
  } catch (err) {
    if (err instanceof RequestError && err.status === 404) return null
    throw err
  }
}
