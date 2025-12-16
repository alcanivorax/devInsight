import { octokit } from "./client";
import type { RepoMetadata } from "./types";

export async function getRepoMetadata(
  owner: string,
  repo: string
): Promise<RepoMetadata> {
  const { data } = await octokit.rest.repos.get({ owner, repo });
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
  };
}
