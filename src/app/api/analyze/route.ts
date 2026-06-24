import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  analyzeRepository,
  handleApiError,
  NotFoundError,
} from '@devinsight/core'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const repoInput = searchParams.get('repo')

    if (!repoInput) {
      throw new NotFoundError('Repository')
    }

    const analysis = await analyzeRepository(repoInput)

    return NextResponse.json({ success: true, data: analysis }, { status: 200 })
  } catch (error) {
    return handleApiError(error)
  }
}
