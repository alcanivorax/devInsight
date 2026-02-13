import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { parseRepoInput } from '@/lib/parseRepoInput'
import {
  getRepoMetadata,
  getRepoPackageJson,
  getRepoReadme,
  getRepoTree,
} from '@/lib/github'
import {
  extractMetadataInfo,
  extractPackageJsonInfo,
  extractReadmeInfo,
  extractTechHints,
  extractTreeSignal,
} from '@/lib/analyzer/extractors'
import {
  createIdentityContext,
  createSetupContext,
  createStructureContext,
  createTechContext,
} from '@/lib/analyzer/context'
import { handleApiError, NotFoundError } from '@/lib/error'
import { assembleRepoAnalysis } from '@/lib/analyzer/assemble'
import { mergeTechHintsWithPackageInfo } from '@/lib/analyzer/merge'
import { buildIdentityPrompt } from '@/lib/analyzer/ai'
import { buildSetupPrompt } from '@/lib/analyzer/ai'
import { buildTechPrompt } from '@/lib/analyzer/ai'
import { buildStructurePrompt } from '@/lib/analyzer/ai'
import { classifyRepoType } from '@/lib/analyzer/classify'
import { resolveStructuralEntryPoints } from '@/lib/analyzer/resolve'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const repoInput = searchParams.get('repo')

    if (!repoInput) {
      throw new NotFoundError('Repository')
    }

    const { owner, repo } = parseRepoInput(repoInput)

    // ─── Fetch raw data ─────────────────────────────
    const metadata = await getRepoMetadata(owner, repo)
    const readme = await getRepoReadme(owner, repo)
    const packageJson = await getRepoPackageJson(owner, repo)
    const tree = await getRepoTree(owner, repo)

    if (!readme) {
      throw new NotFoundError('Readme')
    }

    if (!packageJson) {
      throw new NotFoundError('Package Json')
    }

    // ─── Extract structured info ────────────────────
    const extractedReadme = await extractReadmeInfo(readme)
    const extractedMetadata = await extractMetadataInfo(metadata)
    const extractedTreeSignal = await extractTreeSignal(tree)
    const extractedTechHints = await extractTechHints(tree)
    const extractedPackageJson = await extractPackageJsonInfo(packageJson)

    // ─── Merge Extractors ─────────────────────────────
    const mergeTechContext = mergeTechHintsWithPackageInfo(
      extractedTechHints,
      extractedPackageJson
    )

    // ─── Classification ─────────────────────────────
    const classification = classifyRepoType({
      packageInfo: extractedPackageJson,
      treeSignals: extractedTreeSignal,
      readme: extractedReadme,
    })

    // ─── Resolve ─────────────────────────────
    const resolvedEntryPoint = await resolveStructuralEntryPoints({
      packageInfo: extractedPackageJson,
      repoType: classification.type,
    })

    // ─── Build contexts ─────────────────────────────
    const identityContext = createIdentityContext(
      extractedReadme,
      extractedMetadata,
      classification
    )

    const techContext = createTechContext(mergeTechContext)
    const structureContext = createStructureContext(
      extractedTreeSignal,
      resolvedEntryPoint
    )
    const setupContext = createSetupContext(
      extractedReadme,
      extractedPackageJson
    )

    // ─── Build prompts ─────────────────────────────
    const identity = await buildIdentityPrompt(identityContext)
    const setup = await buildSetupPrompt(setupContext)
    const tech = await buildTechPrompt(techContext)
    const structure = await buildStructurePrompt(structureContext)

    const prompt = {
      identity,
      tech,
      structure,
      setup,
    }

    // ─── Response ─────────────────────────────
    const response = await assembleRepoAnalysis(prompt)

    // console.log(response.identity);
    // console.log(response.tech);
    // console.log(response.structure);
    // console.log(response.setup);
    // ─── Final response ─────────────────────────────
    return NextResponse.json(
      {
        success: true,
        data: response,
      },
      { status: 200 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
