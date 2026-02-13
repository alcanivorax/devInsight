import { octokit } from './client'

export async function getRepoReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const res = await octokit.rest.repos.getReadme({ owner, repo })

    if (!res.data.content) return null

    return Buffer.from(res.data.content, 'base64').toString('utf-8')
  } catch (err: any) {
    if (err.status === 404) return null
    throw err
  }
}
