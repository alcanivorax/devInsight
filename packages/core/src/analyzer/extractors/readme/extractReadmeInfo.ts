import type { ReadmeInfo } from '../types'
import { extractTitle } from './extractTitle'
import { extractSection } from './extractSection'
import { extractIntroParagraph } from './extractIntroParagraph'
import { extractCompositeSection } from './extractCompositeSection'
import { isMeaningfulDescription } from '../../../helpers/isMeaningfulDescription'

export async function extractReadmeInfo(readme: string): Promise<ReadmeInfo> {
  const normalizedReadme = readme.replace(/\r\n/g, '\n').trim()

  const title = extractTitle(normalizedReadme)

  const rawDescription =
    extractSection(normalizedReadme, [
      'about',
      'overview',
      'introduction',
      'description',
      'what is this',
      'why',
    ]) ?? extractIntroParagraph(normalizedReadme)

  const description =
    rawDescription && isMeaningfulDescription(rawDescription)
      ? rawDescription
      : null

  const installation = extractCompositeSection(normalizedReadme, {
    headers: [
      'installation',
      'install',
      'setup',
      'getting started',
      'prerequisites',
      'running locally',
    ],
    mustIncludeAny: [
      /git\s+clone/i,
      /(npm|pnpm|yarn)\s+install/i,
      /(npm|pnpm|yarn)\s+(dev|start)/i,
    ],
  })

  return { title, description, installation, raw: normalizedReadme }
}
