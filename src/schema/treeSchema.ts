import { z } from "zod";

export const treeItemSchema = z.object({
  path: z.string(),

  type: z.enum(["blob", "tree"]),

  // optional but common
  size: z.number().int().nonnegative().optional(),

  mode: z.string().optional(),
  sha: z.string().optional(),
  url: z.string().url().optional(),
});

export const treeSchema = z.array(treeItemSchema);

export type TreeItem = z.infer<typeof treeItemSchema>;
export type RawRepoTree = z.infer<typeof treeSchema>;
