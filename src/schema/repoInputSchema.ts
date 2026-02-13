import { z } from 'zod'
import { githubRepoUrlSchema } from './githubRepoUrlSchema'

export const repoInputSchema = z.union([
  githubRepoUrlSchema,
  z
    .string()
    .trim()
    .regex(/^[^/]+\/[^/]+$/, 'Invalid repo shorthand'),
])
