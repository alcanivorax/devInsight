import { octokit } from './client'
import { treeSchema } from './types'
import type { RawRepoTree } from './types'

export async function getRepoTree(
  owner: string,
  repo: string
): Promise<RawRepoTree> {
  const repoInfo = await octokit.rest.repos.get({ owner, repo })
  const branch = repoInfo.data.default_branch

  const branchRes = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch,
  })

  const treeSha = branchRes.data.commit.commit.tree.sha

  const treeRes = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: treeSha,
    recursive: 'true',
  })

  return treeSchema.parse(treeRes.data.tree)
}
