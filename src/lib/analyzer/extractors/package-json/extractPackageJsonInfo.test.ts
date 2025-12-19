import { describe, it, expect } from "vitest";
import { extractPackageJsonInfo } from "./extractPackageJsonInfo";
import { dummyPackageJson } from "./__fixtures__/packageJson";

describe("extractPackageJsonInfo (smoke test)", () => {
  it("extracts values correctly from package.json", async () => {
    const result = await extractPackageJsonInfo(dummyPackageJson);

    // verify a few key truths
    expect(result.name).toBe("devinsight-sample");
    expect(result.version).toBe("0.1.0");
    expect(result.dependencies).toContain("next");
    expect(result.devDependencies).toContain("typescript");
    expect(result.scripts.dev).toBe("next dev");
  });
});
