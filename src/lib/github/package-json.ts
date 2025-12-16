import { octokit } from "./client";
import type { PackageJson } from "./types";

export async function getRepoPackageJson(
  owner: string,
  repo: string
): Promise<PackageJson | null> {
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: "package.json",
    });

    if ("content" in res.data) {
      const decoded = Buffer.from(res.data.content, "base64").toString("utf-8");
      return JSON.parse(decoded);
    }

    return null;
  } catch (err: any) {
    if (err.status === 404) return null;
    throw err;
  }
}
