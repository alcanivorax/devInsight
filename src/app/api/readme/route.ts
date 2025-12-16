import { NextRequest, NextResponse } from "next/server";
import { getRepoReadme } from "@/lib/github";
import { parseRepoInput } from "@/lib/parseRepoInput";
import { handleApiError, NotFoundError } from "@/lib/error";
import { extractReadmeInfo } from "@/lib/analyzer/extractors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const repoInput = searchParams.get("repo");

    if (!repoInput) {
      throw new NotFoundError("Repository");
    }

    const { owner, repo } = parseRepoInput(repoInput);

    const readme = await getRepoReadme(owner, repo);

    if (!readme) {
      throw new NotFoundError("README");
    }

    const info = await extractReadmeInfo(readme);

    return NextResponse.json({
      owner,
      repo,
      readme,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
