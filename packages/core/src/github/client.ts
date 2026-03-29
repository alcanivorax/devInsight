import { Octokit } from 'octokit'

if (!process.env.GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN is missing')
}

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})
