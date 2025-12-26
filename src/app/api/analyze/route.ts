import { NextRequest, NextResponse } from "next/server";
import { parseRepoInput } from "@/lib/parseRepoInput";
import {
  getRepoMetadata,
  getRepoPackageJson,
  getRepoReadme,
  getRepoTree,
} from "@/lib/github";
import {
  extractMetadataInfo,
  extractPackageJsonInfo,
  extractReadmeInfo,
  extractTechHints,
  extractTreeSignal,
} from "@/lib/analyzer/extractors";
import {
  createIdentityContext,
  createRepoContext,
  createSetupContext,
  createStructureContext,
  createTechContext,
} from "@/lib/analyzer/context";
import { handleApiError, NotFoundError } from "@/lib/error";
import { runPrompt } from "@/lib/analyzer/ai/runPrompt";
import { buildRepoAnalysisPrompt } from "@/lib/analyzer/ai/prompt";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    console.log("this is url: ", req.url);
    console.log("this is SearchParams: ", searchParams);
    const repoInput = searchParams.get("repo");

    console.log("this si repoInput: ", repoInput);
    if (!repoInput) {
      throw new NotFoundError("Repository");
    }

    const { owner, repo } = parseRepoInput(repoInput);
    console.log("this is owner and repo", owner, repo);

    // ─── Fetch raw data ─────────────────────────────
    const metadata = await getRepoMetadata(owner, repo);
    const readme = await getRepoReadme(owner, repo);
    const packageJson = await getRepoPackageJson(owner, repo);
    const tree = await getRepoTree(owner, repo);

    if (!readme || !packageJson || !tree || !metadata) {
      throw new NotFoundError("Repository data");
    }

    // ─── Extract structured info ────────────────────
    const extractedReadme = await extractReadmeInfo(readme);
    const extractedMetadata = await extractMetadataInfo(metadata);
    const extractedTree = await extractTreeInfo(tree);
    const extractedPackageJson = await extractPackageJsonInfo(packageJson);

    // ─── Build contexts ─────────────────────────────
    const identityContext = createIdentityContext(
      extractedReadme,
      extractedMetadata
    );
    const techContext = createTechContext(extractedPackageJson);
    const structureContext = createStructureContext(extractedTree);
    const setupContext = createSetupContext(
      extractedReadme,
      extractedPackageJson
    );

    const repoContext = createRepoContext(
      identityContext,
      techContext,
      structureContext,
      setupContext
    );

    const prompt = buildRepoAnalysisPrompt(repoContext);
    const aiResponse = await aiSummary(prompt);

    console.log(aiResponse);
    // ─── Final response ─────────────────────────────
    return NextResponse.json(
      {
        success: true,
        data: aiResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
