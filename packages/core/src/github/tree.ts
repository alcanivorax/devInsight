import { RequestError } from 'octokit'
import { withGitHubAuthFallback } from './client'
import { treeSchema } from './types'
import type { RawRepoTree } from './types'

export async function getRepoTree(
  owner: string,
  repo: string,
  defaultBranch?: string
): Promise<RawRepoTree | null> {
  try {
    const branch =
      defaultBranch ??
      (
        await withGitHubAuthFallback((octokit) =>
          octokit.rest.repos.get({ owner, repo })
        )
      ).data.default_branch

    const branchRes = await withGitHubAuthFallback((octokit) =>
      octokit.rest.repos.getBranch({
        owner,
        repo,
        branch,
      })
    )

    const treeSha = branchRes.data.commit.commit.tree.sha

    const treeRes = await withGitHubAuthFallback((octokit) =>
      octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: treeSha,
        recursive: 'true',
      })
    )

    if (treeRes.data.truncated) {
      throw new Error(`Repository tree is truncated for ${owner}/${repo}`)
    }

    return treeSchema.parse(treeRes.data.tree)
  } catch (err) {
    if (err instanceof RequestError && err.status === 404) return null
    throw err
  }
}
