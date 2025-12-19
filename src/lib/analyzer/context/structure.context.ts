import { StructureContext } from "./types";
import { TreeInfo } from "../extractors/types";

export function createStructureContext(tree: TreeInfo): StructureContext {
  const sentences: string[] = [];

  if (tree.hasDocker) {
    sentences.push("The repository includes Docker configuration.");
  }

  if (tree.hasCI) {
    sentences.push("CI pipelines are configured.");
  }

  if (tree.hasTests) {
    sentences.push("Automated tests are present.");
  }

  if (tree.entryPoint) {
    sentences.push(
      `The application entry point appears to be ${tree.entryPoint}.`
    );
  }

  const overview =
    sentences.length > 0
      ? sentences.join(" ")
      : "Repository structure could not be clearly inferred from the file tree.";

  return {
    overview,
    entryPoint: tree.entryPoint ?? null,
  };
}
