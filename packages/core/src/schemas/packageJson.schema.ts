import { z } from 'zod'

export const packageJsonSchema = z.object({
  name: z.string().optional(),
  version: z.string().optional(),
  description: z.string().optional(),

  scripts: z.record(z.string(), z.string()).optional(),

  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),

  engines: z.record(z.string(), z.string()).optional(),

  packageManager: z.string().optional(),

  main: z.string().optional(),
  module: z.string().optional(),
  exports: z.unknown().optional(),

  bin: z.record(z.string(), z.string()).optional(),

  pnpm: z
    .object({
      overrides: z.record(z.string(), z.string()).optional(),
      patchedDependencies: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
})

export type RawPackageJson = z.infer<typeof packageJsonSchema>
