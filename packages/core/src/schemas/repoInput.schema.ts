import { z } from 'zod'
import { githubRepoUrlSchema } from './githubRepoUrl.schema'

export const repoInputSchema = z.union([
  githubRepoUrlSchema,
  z
    .string()
    .trim()
    .regex(/^[^/]+\/[^/]+$/, 'Invalid repo shorthand'),
])
