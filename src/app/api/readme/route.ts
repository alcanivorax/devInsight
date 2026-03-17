import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  getRepoReadme,
  parseRepoInput,
  handleApiError,
  NotFoundError,
  extractReadmeInfo,
} from '@devinsight/core'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const repoInput = searchParams.get('repo')

    if (!repoInput) {
      throw new NotFoundError('Repository')
    }

    const { owner, repo } = parseRepoInput(repoInput)

    const readme = await getRepoReadme(owner, repo)

    if (!readme) {
      throw new NotFoundError('README')
    }

    const info = await extractReadmeInfo(readme)

    return NextResponse.json({
      owner,
      repo,
      readme,
      info,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
