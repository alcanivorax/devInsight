import { PackageInfo } from "../types";
import { detectFramework } from "./detectFramework";
import { detectLanguage } from "./detectLanguage";
import { detectPackageManager } from "./detectPackageManager";
import { detectRuntime } from "./detectRuntime";

export async function extractPackageJsonInfo(
  packageJson: string
): Promise<PackageInfo> {
  let parsed: any;

  /*
JSON.parse() converts a string JSON into JS object
*/

  try {
    parsed = JSON.parse(packageJson);
  } catch (error) {
    throw new Error("Invalid package.json: Unable to parse JSON");
  }

  /*
Object.keys() returns an array of an object’s own property names (keys).

example: 
const user = {
  name: "Alice",
  age: 25,
  city: "Paris"
};

const keys = Object.keys(user);
console.log(keys);

output: 
["name", "age", "city"]

*/

  const deps = Object.keys(parsed.dependencies || {});
  const devDeps = Object.keys(parsed.devDependencies || {});
  const allDeps = [...deps, ...devDeps];

  const framework = detectFramework(allDeps);
  const runtime = detectRuntime(allDeps, parsed.engines);
  const packageManager = detectPackageManager(parsed);
  const language = detectLanguage(allDeps, devDeps);

  return {
    name: parsed.name || null,
    version: parsed.version || null,
    description: parsed.description || null,
    language,
    framework,
    runtime,
    packageManager,
    scripts: {
      dev: parsed.scripts?.dev || parsed.scripts?.develop || null,
      build: parsed.scripts?.build || null,
      start: parsed.scripts?.start || null,
      test: parsed.scripts?.test || null,
    },
    dependencies: deps,
    devDependencies: devDeps,
    entryPoint: parsed.main || parsed.module || parsed.exports || null,
  };
}
