'use client'

import type { FormEvent, ReactNode } from 'react'
import { useMemo, useState } from 'react'

interface RepoAnalysis {
  identity: {
    summary: string
    purpose?: string | null
    audience?: string | null
  }
  tech: {
    stack: string
    notableLibraries?: string[]
  }
  structure: {
    overview: string[]
    entryPoints?: string[] | null
    importantFiles?: string[]
    architecture?: string[]
  }
  setup: {
    installation: string | null
    runCommand?: string | null
    nextSteps?: string[]
  }
  onboarding?: {
    startHere: string[]
    keySignals: string[]
    gaps: string[]
  }
}

const EXAMPLE_REPOS = [
  'https://github.com/vercel/next.js',
  'https://github.com/remix-run/react-router',
  'https://github.com/fastify/fastify',
]

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [data, setData] = useState<RepoAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const repoLabel = useMemo(() => getRepoLabel(url), [url])

  async function analyzeRepo() {
    if (!url.trim()) {
      setError('Enter a GitHub repository URL.')
      return
    }

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch(`/api/analyze?repo=${encodeURIComponent(url)}`)
      const json = await res.json()

      if (!res.ok || json.error) {
        throw new Error(json.error ?? 'Analysis failed.')
      }

      setData(json.data)
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!loading) void analyzeRepo()
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#111111]">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-rows-[auto_1fr] px-5 py-5 sm:px-8 lg:px-10">
        <header className="border-b-2 border-[#111111] pb-5">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-mono text-xs uppercase text-[#5f5b51]">
                AI repository analyzer / MVP
              </p>
              <h1 className="mt-3 text-5xl font-semibold leading-none tracking-tight sm:text-7xl">
                devInsight
              </h1>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#4f4b42] md:text-right">
              Structured, cautious summaries of GitHub repositories: identity,
              stack, structure, and setup.
            </p>
          </div>
        </header>

        <div className="grid gap-8 py-8 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-5">
            <form
              onSubmit={onSubmit}
              className="border-2 border-[#111111] bg-[#fdfbf6] p-4 shadow-[8px_8px_0_#111111]"
            >
              <label className="block">
                <span className="mb-3 block font-mono text-xs uppercase text-[#5f5b51]">
                  GitHub repository
                </span>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  placeholder="https://github.com/vercel/next.js"
                  className="w-full border-2 border-[#111111] bg-[#f4f1ea] px-3 py-3 font-mono text-sm outline-none placeholder:text-[#8a8578] focus:bg-white disabled:opacity-50"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full border-2 border-[#111111] bg-[#111111] px-4 py-3 text-sm font-semibold uppercase text-[#fdfbf6] transition hover:bg-[#d7ff5f] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Analyzing' : 'Analyze'}
              </button>
            </form>

            <div className="border-2 border-[#111111] bg-[#e8e3d8] p-4">
              <p className="mb-3 font-mono text-xs uppercase text-[#5f5b51]">
                Try one
              </p>
              <div className="space-y-2">
                {EXAMPLE_REPOS.map((repo) => (
                  <button
                    key={repo}
                    type="button"
                    onClick={() => setUrl(repo)}
                    className="block w-full border border-[#111111] bg-[#fdfbf6] px-3 py-2 text-left font-mono text-xs transition hover:bg-[#d7ff5f]"
                  >
                    {getRepoLabel(repo)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 border-2 border-[#111111] font-mono text-xs uppercase">
              <Stat label="Input" value="GitHub" />
              <Stat label="Output" value="JSON" />
              <Stat label="Signals" value="4" />
              <Stat label="Mode" value="Live" />
            </div>
          </aside>

          <section>
            {error && <ErrorState message={error} />}
            {loading && <LoadingState repoLabel={repoLabel} />}
            {!loading && data && (
              <Results analysis={data} repoLabel={repoLabel} />
            )}
            {!loading && !data && !error && <EmptyState />}
          </section>
        </div>
      </div>
    </main>
  )
}

function Results({
  analysis,
  repoLabel,
}: {
  analysis: RepoAnalysis
  repoLabel: string
}) {
  const entryPoints = analysis.structure.entryPoints ?? []

  return (
    <div className="space-y-5">
      <div className="border-2 border-[#111111] bg-[#111111] p-5 text-[#fdfbf6]">
        <p className="font-mono text-xs uppercase text-[#d7ff5f]">
          Generated analysis
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          {repoLabel}
        </h2>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel number="01" title="Overview">
          <p className="text-lg leading-8">{analysis.identity.summary}</p>
          <DefinitionList
            items={[
              { label: 'Purpose', value: analysis.identity.purpose },
              { label: 'Audience', value: analysis.identity.audience },
            ]}
          />
        </Panel>

        <Panel number="02" title="Tech Stack">
          <p className="leading-7">{analysis.tech.stack}</p>
          <InlineList
            title="Notable libraries"
            items={analysis.tech.notableLibraries}
          />
        </Panel>
      </div>

      <Panel number="03" title="Project Structure">
        <div className="space-y-3">
          {analysis.structure.overview.map((item) => (
            <div
              key={item}
              className="grid grid-cols-[24px_1fr] gap-3 border-t border-[#111111] pt-3 text-sm leading-6 first:border-t-0 first:pt-0"
            >
              <span className="font-mono text-xs">--</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {entryPoints.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2 border-t border-[#111111] pt-4">
            {entryPoints.map((entryPoint) => (
              <code
                key={entryPoint}
                className="border border-[#111111] bg-[#f4f1ea] px-3 py-2 font-mono text-xs"
              >
                {entryPoint}
              </code>
            ))}
          </div>
        )}

        <InsightList
          title="Architecture signals"
          items={analysis.structure.architecture}
        />
        <InsightList
          title="Important files"
          items={analysis.structure.importantFiles}
        />
      </Panel>

      <Panel number="04" title="Setup">
        <div className="grid gap-4 md:grid-cols-2">
          <CommandBlock
            label="Installation"
            value={analysis.setup.installation}
            fallback="No installation command found."
          />
          <CommandBlock
            label="Run command"
            value={analysis.setup.runCommand}
            fallback="No run command found."
          />
        </div>
        <InsightList
          title="Suggested next steps"
          items={analysis.setup.nextSteps}
        />
      </Panel>

      {analysis.onboarding && (
        <Panel number="05" title="Developer Onboarding">
          <div className="grid gap-5 lg:grid-cols-3">
            <InsightList
              title="Start here"
              items={analysis.onboarding.startHere}
              compact
            />
            <InsightList
              title="Key signals"
              items={analysis.onboarding.keySignals}
              compact
            />
            <InsightList
              title="Gaps"
              items={analysis.onboarding.gaps}
              compact
            />
          </div>
        </Panel>
      )}

      <div className="border-2 border-[#111111] bg-[#e8e3d8] p-4 font-mono text-xs uppercase leading-5 text-[#4f4b42]">
        TODO: Add saved analyses, source provenance for each claim, and a
        comparison mode for multiple repositories.
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="grid min-h-[420px] place-items-center border-2 border-[#111111] bg-[#fdfbf6] p-8 text-center">
      <div className="max-w-md">
        <p className="font-mono text-xs uppercase text-[#5f5b51]">
          Waiting for input
        </p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight">
          Paste a repository URL.
        </h2>
        <p className="mt-4 text-sm leading-6 text-[#5b564c]">
          Results will appear here as a structured technical brief.
        </p>
      </div>
    </div>
  )
}

function LoadingState({ repoLabel }: { repoLabel: string }) {
  return (
    <div className="border-2 border-[#111111] bg-[#fdfbf6] p-5">
      <div className="flex items-start justify-between gap-4 border-b-2 border-[#111111] pb-5">
        <div>
          <p className="font-mono text-xs uppercase text-[#5f5b51]">
            Analyzing
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            {repoLabel}
          </h2>
        </div>
        <span className="h-5 w-5 animate-pulse bg-[#111111]" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {['Fetch', 'Extract', 'Classify', 'Summarize'].map((step, index) => (
          <div key={step} className="border border-[#111111] p-3">
            <p className="font-mono text-xs text-[#5f5b51]">0{index + 1}</p>
            <p className="mt-6 text-sm font-semibold uppercase">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="border-2 border-[#111111] bg-[#ffe9df] p-5 shadow-[8px_8px_0_#111111]">
      <p className="font-mono text-xs uppercase text-[#8a2c1c]">
        Analysis failed
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">{message}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-[#6b4037]">
        Check that the repository exists and that the required GitHub/model
        environment variables are configured.
      </p>
    </div>
  )
}

function Panel({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: ReactNode
}) {
  return (
    <section className="border-2 border-[#111111] bg-[#fdfbf6] p-5">
      <div className="mb-5 flex items-start justify-between gap-5 border-b border-[#111111] pb-3">
        <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        <span className="font-mono text-xs text-[#5f5b51]">{number}</span>
      </div>
      {children}
    </section>
  )
}

function CommandBlock({
  label,
  value,
  fallback,
}: {
  label: string
  value?: string | null
  fallback: string
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-xs uppercase text-[#5f5b51]">{label}</p>
      {value ? (
        <pre className="overflow-x-auto border-2 border-[#111111] bg-[#111111] p-4 font-mono text-sm leading-6 text-[#d7ff5f]">
          {value}
        </pre>
      ) : (
        <p className="border-2 border-[#111111] bg-[#f4f1ea] p-4 font-mono text-sm">
          {fallback}
        </p>
      )}
    </div>
  )
}

function DefinitionList({
  items,
}: {
  items: { label: string; value?: string | null }[]
}) {
  const visibleItems = items.filter((item) => item.value)

  if (visibleItems.length === 0) return null

  return (
    <dl className="mt-5 grid gap-3 border-t border-[#111111] pt-4 sm:grid-cols-2">
      {visibleItems.map((item) => (
        <div key={item.label}>
          <dt className="font-mono text-xs uppercase text-[#5f5b51]">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm leading-6">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

function InlineList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null

  return (
    <div className="mt-5 border-t border-[#111111] pt-4">
      <p className="mb-3 font-mono text-xs uppercase text-[#5f5b51]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="border border-[#111111] bg-[#f4f1ea] px-2 py-1 font-mono text-xs"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function InsightList({
  title,
  items,
  compact = false,
}: {
  title: string
  items?: string[]
  compact?: boolean
}) {
  if (!items || items.length === 0) return null

  return (
    <div className={compact ? '' : 'mt-5 border-t border-[#111111] pt-4'}>
      <p className="mb-3 font-mono text-xs uppercase text-[#5f5b51]">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="grid grid-cols-[18px_1fr] gap-2 text-sm leading-6"
          >
            <span className="font-mono text-xs">+</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-[#111111] p-3 odd:border-r even:border-r-0 [&:nth-child(-n+2)]:border-b">
      <p className="text-[#5f5b51]">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  )
}

function getRepoLabel(repoUrl: string): string {
  const fallback = repoUrl.trim() || 'No repository selected'

  try {
    const parsedUrl = new URL(repoUrl)
    const [owner, repo] = parsedUrl.pathname.split('/').filter(Boolean)
    return owner && repo ? `${owner}/${repo}` : fallback
  } catch {
    return fallback
  }
}
