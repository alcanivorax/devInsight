import { RawRepoTree } from "@/schema/treeSchema";
import { octokit } from "./client";
import { treeSchema } from "@/schema/treeSchema";

export async function getRepoTree(
  owner: string,
  repo: string
): Promise<RawRepoTree> {
  const repoInfo = await octokit.rest.repos.get({ owner, repo });
  const branch = repoInfo.data.default_branch;

  const branchRes = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch,
  });

  const treeSha = branchRes.data.commit.commit.tree.sha;

  const treeRes = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: treeSha,
    recursive: "true", // IMPORTANT if you want full tree
  });
  console.log(treeRes);

  // 🔐 Runtime validation
  return treeSchema.parse(treeRes.data.tree);
}
