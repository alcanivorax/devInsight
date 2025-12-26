import { test, expect } from "vitest";
import { extractTreeInfo } from "./extractTreeSignal";
import { dummyTree } from "./__fixtures__/tree";

test("extractTreeInfo detects basic project structure", () => {
  const info = extractTreeInfo(dummyTree);

  expect(info.hasDocker).toBe(true);
  expect(info.hasCI).toBe(true);
  expect(info.hasTests).toBe(true);
  expect(info.language).toBe("JavaScript");
});
