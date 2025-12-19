import { describe, it, expect } from "vitest";
import { extractMetadataInfo } from "./extractMetadataInfo";
import { dummyMetadata } from "./__fixtures__/metadata";

describe("extractMetadataInfo (smoke test)", () => {
  it("extracts value correctly from metadata", async () => {
    const result = await extractMetadataInfo(dummyMetadata);

    expect(result.name).toBe("devinsight-sample");
    expect(result.description).toBe(
      "A sample repository for testing DevInsight"
    );
    expect(result.language).toBe("TypeScript");
    expect(result.license).toBe("MIT");
    expect(result.topics).toEqual(
      expect.arrayContaining(["nextjs", "analysis", "ai", "developer-tools"])
    );
    expect(result.defaultBranch).toBe("main");
  });
});
