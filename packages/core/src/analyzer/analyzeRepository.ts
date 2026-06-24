import { NotFoundError } from '../error'
import { getRepoData } from '../github'
import { assembleRepoAnalysis, type RepoAnalysis } from './assemble'
import {
  buildIdentityPrompt,
  buildOnboardingPrompt,
  buildSetupPrompt,
  buildStructurePrompt,
  buildTechPrompt,
} from './ai'
import { classifyRepoType } from './classify'
import {
  createIdentityContext,
  createOnboardingContext,
  createSetupContext,
  createStructureContext,
  createTechContext,
} from './context'
import {
  extractMetadataInfo,
  extractPackageJsonInfo,
  extractReadmeInfo,
  extractRepositoryMap,
  extractTechHints,
  extractTreeSignal,
} from './extractors'
import { mergeTechHintsWithPackageInfo } from './merge'
import { resolveStructuralEntryPoints } from './resolve'

export async function analyzeRepository(
  repoInput: string
): Promise<RepoAnalysis> {
  const { readme, pkg, tree, metadata } = await getRepoData(repoInput)

  if (!readme) throw new NotFoundError('Readme')
  if (!pkg) throw new NotFoundError('Package Json')
  if (!metadata) throw new NotFoundError('Metadata')
  if (!tree) throw new NotFoundError('Tree Signal')

  const [extractedReadme, extractedMetadata] = await Promise.all([
    extractReadmeInfo(readme),
    extractMetadataInfo(metadata),
  ])

  const extractedPackageJson = extractPackageJsonInfo(pkg)
  const extractedTreeSignal = extractTreeSignal(tree)
  const extractedTechHints = extractTechHints(tree)
  const repositoryMap = extractRepositoryMap(tree)

  const mergedTech = mergeTechHintsWithPackageInfo(
    extractedTechHints,
    extractedPackageJson
  )

  const classification = classifyRepoType({
    packageInfo: extractedPackageJson,
    treeSignals: extractedTreeSignal,
    readme: extractedReadme,
  })

  const resolvedEntryPoints = resolveStructuralEntryPoints({
    packageInfo: extractedPackageJson,
    repoType: classification.type,
  })

  const identityContext = createIdentityContext(
    extractedReadme,
    extractedMetadata,
    classification
  )
  const techContext = createTechContext(mergedTech, extractedPackageJson)
  const structureContext = createStructureContext(
    extractedTreeSignal,
    resolvedEntryPoints,
    repositoryMap
  )
  const setupContext = createSetupContext(extractedReadme, extractedPackageJson)
  const onboardingContext = createOnboardingContext({
    identity: identityContext,
    tech: techContext,
    structure: structureContext,
    setup: setupContext,
  })

  return assembleRepoAnalysis({
    identity: buildIdentityPrompt(identityContext),
    tech: buildTechPrompt(techContext),
    structure: buildStructurePrompt(structureContext),
    setup: buildSetupPrompt(setupContext),
    onboarding: buildOnboardingPrompt(onboardingContext),
  })
}
