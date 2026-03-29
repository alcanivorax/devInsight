import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  handleApiError,
  NotFoundError,
  parseRepoInput,
  getRepoMetadata,
} from '@devinsight/core'
import { getRepoLanguage } from '@devinsight/core/github/language'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const repoInput = searchParams.get('repo')

    if (!repoInput) {
      throw new NotFoundError('Repository')
    }

    const { owner, repo } = parseRepoInput(repoInput)
    const metadata = await getRepoMetadata(owner, repo)
    const language = await getRepoLanguage(owner, repo)
    return NextResponse.json({
      owner,
      repo,
      metadata,
      language,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
