import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  parseRepoInput,
  getRepoMetadata,
  getRepoPackageJson,
  getRepoReadme,
  getRepoTree,
  extractMetadataInfo,
  extractPackageJsonInfo,
  extractReadmeInfo,
  extractTreeSignal,
  extractTechHints,
  mergeTechHintsWithPackageInfo,
  classifyRepoType,
  resolveStructuralEntryPoints,
  createIdentityContext,
  createTechContext,
  createStructureContext,
  createSetupContext,
  buildIdentityPrompt,
  buildTechPrompt,
  buildStructurePrompt,
  buildSetupPrompt,
  assembleRepoAnalysis,
  handleApiError,
  NotFoundError,
} from '@devinsight/core'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const repoInput = searchParams.get('repo')

    if (!repoInput) {
      throw new NotFoundError('Repository')
    }

    const { owner, repo } = parseRepoInput(repoInput)

    // ─── Fetch raw data ──────────────────────────────────────────────────────
    const [metadata, readme, packageJson, tree] = await Promise.all([
      getRepoMetadata(owner, repo),
      getRepoReadme(owner, repo),
      getRepoPackageJson(owner, repo),
      getRepoTree(owner, repo),
    ])

    if (!readme) {
      throw new NotFoundError('Readme')
    }

    if (!packageJson) {
      throw new NotFoundError('Package Json')
    }

    // ─── Extract structured info ─────────────────────────────────────────────
    const [extractedReadme, extractedMetadata] = await Promise.all([
      extractReadmeInfo(readme),
      extractMetadataInfo(metadata),
    ])

    const extractedPackageJson = extractPackageJsonInfo(packageJson)

    const extractedTreeSignal = extractTreeSignal(tree)
    const extractedTechHints = extractTechHints(tree)

    // ─── Merge ───────────────────────────────────────────────────────────────
    const mergedTech = mergeTechHintsWithPackageInfo(
      extractedTechHints,
      extractedPackageJson
    )

    // ─── Classify ────────────────────────────────────────────────────────────
    const classification = classifyRepoType({
      packageInfo: extractedPackageJson,
      treeSignals: extractedTreeSignal,
      readme: extractedReadme,
    })

    // ─── Resolve ─────────────────────────────────────────────────────────────
    const resolvedEntryPoints = resolveStructuralEntryPoints({
      packageInfo: extractedPackageJson,
      repoType: classification.type,
    })

    // ─── Build contexts ───────────────────────────────────────────────────────
    const identityContext = createIdentityContext(
      extractedReadme,
      extractedMetadata,
      classification
    )
    const techContext = createTechContext(mergedTech)
    const structureContext = createStructureContext(
      extractedTreeSignal,
      resolvedEntryPoints
    )
    const setupContext = createSetupContext(
      extractedReadme,
      extractedPackageJson
    )

    // ─── Build prompts ────────────────────────────────────────────────────────
    const prompts = {
      identity: buildIdentityPrompt(identityContext),
      tech: buildTechPrompt(techContext),
      structure: buildStructurePrompt(structureContext),
      setup: buildSetupPrompt(setupContext),
    }

    // ─── Assemble & respond ───────────────────────────────────────────────────
    const analysis = await assembleRepoAnalysis(prompts)

    return NextResponse.json({ success: true, data: analysis }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}
