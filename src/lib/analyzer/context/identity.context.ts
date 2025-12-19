import { MetadataInfo, ReadmeInfo } from "../extractors/types";
import { IdentityContext } from "./types";

export function createIdentityContext(
  readme: ReadmeInfo,
  metadata: MetadataInfo
): IdentityContext {
  const name = readme.title ?? metadata.name ?? null;
  const description = readme.description ?? metadata.description ?? null;

  return {
    name,
    description,
  };
}
