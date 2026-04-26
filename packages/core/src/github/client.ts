import { Octokit } from 'octokit'

let octokit: Octokit | null = null

export function getOctokit(): Octokit {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is missing')
  }

  octokit ??= new Octokit({
    auth: process.env.GITHUB_TOKEN,
  })

  return octokit
}
