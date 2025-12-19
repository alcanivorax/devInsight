import { z } from "zod";

export const metadataSchema = z
  .object({
    name: z.string(),
    fullName: z.string(),
    description: z.string().nullable(),
    stars: z.number().int().nonnegative(),
    forks: z.number().int().nonnegative(),
    watchers: z.number().int().nonnegative(),
    language: z.string().nullable(),
    topics: z.array(z.string()),
    license: z.string().nullable(),
    defaultBranch: z.string(),
    isFork: z.boolean(),
    isArchived: z.boolean(),
    isTemplate: z.boolean(),
    openIssues: z.number().int().nonnegative(),
    sizeKB: z.number().int().nonnegative(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    pushedAt: z.string().datetime(),
  })
  .strict();

export type RawMetadata = z.infer<typeof metadataSchema>;
