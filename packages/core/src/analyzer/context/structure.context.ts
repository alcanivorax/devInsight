import type { TreeSignals } from '../extractors/types'
import type { RepositoryMap } from '../extractors/types'
import type { StructuralEntryPoint } from '../resolve/resolveStructuralEntryPoints'
import type { StructureContext } from './types'

export function createStructureContext(
  tree: TreeSignals,
  entryPoints: StructuralEntryPoint[],
  repositoryMap?: RepositoryMap
): StructureContext {
  const overview: string[] = []

  if (tree.hasDocker) overview.push('Docker configuration is present.')
  if (tree.hasCI) overview.push('CI/CD configuration files are present.')
  if (tree.hasTests)
    overview.push('Test-related files or directories are present.')

  if (overview.length === 0) {
    overview.push(
      'No strong structural signals could be inferred from the repository tree.'
    )
  }

  return {
    overview,
    entryPoints: entryPoints.length > 0 ? entryPoints : undefined,
    topLevelDirectories: repositoryMap?.topLevelDirectories,
    topLevelFiles: repositoryMap?.topLevelFiles,
    importantFiles: repositoryMap?.importantFiles,
    directoryRoles: repositoryMap?.directoryRoles,
    architecturalSignals: repositoryMap?.architecturalSignals,
    featureSignals: repositoryMap?.featureSignals,
    complexityIndicators: repositoryMap?.complexityIndicators,
    counts: repositoryMap?.counts,
  }
}
