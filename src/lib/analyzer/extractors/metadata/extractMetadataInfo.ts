import { MetadataInfo } from "../types";
import { RawMetadata } from "../types";

export async function extractMetadataInfo(
  metadata: RawMetadata
): Promise<MetadataInfo> {
  return {
    name: metadata.name,
    description: metadata.description ?? null,
    language: metadata.language ?? null,
    topics: Array.isArray(metadata.topics) ? metadata.topics : [],
    license: metadata.license ?? null,
    defaultBranch: metadata.defaultBranch ?? null,
  };
}
