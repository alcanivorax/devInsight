import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getRepoPackageJson } from '@/lib/github'
import { handleApiError, NotFoundError } from '@/lib/error'
import { parseRepoInput } from '@/lib/parseRepoInput'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const repoInput = searchParams.get('repo')

    if (!repoInput) {
      throw new NotFoundError('Repository')
    }

    const { owner, repo } = parseRepoInput(repoInput)

    const packageJson = await getRepoPackageJson(owner, repo)

    return NextResponse.json({
      owner,
      repo,
      packageJson,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
