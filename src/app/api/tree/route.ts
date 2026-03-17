import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  handleApiError,
  NotFoundError,
  getRepoTree,
  parseRepoInput,
} from '@devinsight/core'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const repoInput = searchParams.get('repo')

    if (!repoInput) {
      throw new NotFoundError('Repository')
    }

    const { owner, repo } = parseRepoInput(repoInput)
    const tree = await getRepoTree(owner, repo)

    return NextResponse.json({
      owner,
      repo,
      tree,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
