import { z } from 'zod'

// raw for fetch layer
export const rawLanguagesSchema = z.record(z.string(), z.number())
export type RawLanguages = z.infer<typeof rawLanguagesSchema>

// processed for extraction layer
export const languageSchema = z
  .object({
    name: z.string(),
    percentage: z.number().min(0).max(100),
  })
  .strict()

export const languagesSchema = z.array(languageSchema)

export type LanguageItem = z.infer<typeof languageSchema>
