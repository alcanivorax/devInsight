import { z } from "zod";

export const packageJsonSchema = z.object({
  name: z.string().optional(),

  scripts: z.record(z.string(), z.string()).optional(),

  dependencies: z.record(z.string(), z.string()).optional(),

  devDependencies: z.record(z.string(), z.string()).optional(),

  engines: z.record(z.string(), z.string()).optional(),
});

export type RawPackageJson = z.infer<typeof packageJsonSchema>;
