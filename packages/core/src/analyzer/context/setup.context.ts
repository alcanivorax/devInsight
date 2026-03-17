import type { ReadmeInfo } from '../extractors/types'
import type { PackageInfo } from '../extractors/types'
import { resolveRunCommand } from '../resolve/resolveRunCommand'
import type { SetupContext } from './types'

export function createSetupContext(
  readme: ReadmeInfo,
  packageInfo: PackageInfo
): SetupContext {
  return {
    installation: readme.installation ?? null,
    runCommand: resolveRunCommand(packageInfo),
  }
}
