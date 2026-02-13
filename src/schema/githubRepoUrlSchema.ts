import { z } from 'zod'

export const githubRepoUrlSchema = z
  .string()
  .url('Invalid URL')
  .refine((url) => {
    try {
      const { hostname, pathname } = new URL(url)
      if (hostname !== 'github.com') return false

      const parts = pathname
        .replace(/\.git$/, '')
        .split('/')
        .filter(Boolean)

      return parts.length >= 2
    } catch {
      return false
    }
  }, 'Not a valid GitHub repository URL')
