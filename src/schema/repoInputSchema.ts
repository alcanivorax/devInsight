import { z } from "zod";
import { githubRepoUrlSchema } from "./githubRepoUrlSchema";

export const repoInputSchema = z.union([
  githubRepoUrlSchema,
  z.string().regex(/^[^/]+\/[^/]+$/, "Invalid repo shorthand"),
]);
