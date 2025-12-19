import { SetupContext } from "./types";
import { ReadmeInfo, PackageInfo } from "../extractors/types";

export function createSetupContext(
  readme: ReadmeInfo,
  packageJson: PackageInfo
): SetupContext {
  const installation = readme.installation ?? null;
  const runCommand = packageJson.scripts.dev ?? packageJson.scripts.start;

  return {
    installation,
    runCommand,
  };
}
