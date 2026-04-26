import { RequestError } from 'octokit'
import { getOctokit } from './client'
import type { RawMetadata } from './types'

export async function getRepoMetadata(
  owner: string,
  repo: string
): Promise<RawMetadata | null> {
  try {
    const { data } = await getOctokit().rest.repos.get({ owner, repo })
    return {
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.subscribers_count,
      language: data.language,
      topics: data.topics ?? [],
      license: data.license?.spdx_id ?? null,
      defaultBranch: data.default_branch,
      isFork: data.fork,
      isArchived: data.archived,
      isTemplate: data.is_template ?? false,
      openIssues: data.open_issues_count,
      sizeKB: data.size,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      pushedAt: data.pushed_at,
    }
  } catch (err) {
    if (err instanceof RequestError && err.status === 404) return null
    throw err
  }
}
