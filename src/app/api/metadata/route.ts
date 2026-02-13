import { handleApiError, NotFoundError } from "@/lib/error";
import { getRepoMetadata } from "@/lib/github";
import { parseRepoInput } from "@/lib/parseRepoInput";
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const repoInput = searchParams.get("repo");

    if (!repoInput) {
      throw new NotFoundError("Repository");
    }
    const { owner, repo } = parseRepoInput(repoInput);
    const metadata = await getRepoMetadata(owner, repo);

    return NextResponse.json({
      owner,
      repo,
      metadata,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
