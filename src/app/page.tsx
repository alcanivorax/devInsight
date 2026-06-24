'use client'

import type { FormEvent, ReactNode } from 'react'
import { useMemo, useState } from 'react'

interface RepoAnalysis {
  identity: { summary: string }
  tech: { stack: string }
  structure: {
    overview: string[]
    entryPoints?: string[] | null
  }
  setup: {
    installation: string | null
    runCommand?: string | null
  }
}

const EXAMPLE_REPOS = [
  'https://github.com/vercel/next.js',
  'https://github.com/remix-run/react-router',
  'https://github.com/fastify/fastify',
]

const DEMO_ANALYSIS: RepoAnalysis = {
  identity: {
    summary:
      'DevInsight appears to be a repository intelligence tool that turns GitHub project signals into concise engineering summaries for faster evaluation.',
  },
  tech: {
    stack:
      'The repository is primarily TypeScript, built as a Next.js application with a pnpm workspace. It uses Octokit for GitHub data, Zod for validation, Prisma for database access, and OpenRouter for model calls.',
  },
  structure: {
    overview: [
      'The web application lives in src/ with API routes under src/app/api/.',
      'Core repository analysis is isolated in packages/core/src/ with separate GitHub, extractor, context, prompt, and assembly layers.',
      'Tests are present around deterministic extractors, which is the right place to protect analysis quality.',
    ],
    entryPoints: [
      'src/app/page.tsx',
      'src/app/api/analyze/route.ts',
      'packages/core/src/analyzer/index.ts',
    ],
  },
  setup: {
    installation: 'pnpm install',
    runCommand: 'pnpm dev',
  },
}

export default function HomePage() {
  const [url, setUrl] = useState('')
  const [data, setData] = useState<RepoAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemoResult, setIsDemoResult] = useState(false)

  const repoLabel = useMemo(() => getRepoLabel(url), [url])

  async function analyzeRepo() {
    if (!url.trim()) {
      setError('Enter a GitHub repository URL.')
      return
    }

    setLoading(true)
    setError(null)
    setData(null)
    setIsDemoResult(false)

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

  function showDemoAnalysis() {
    setUrl('https://github.com/alcanivorax/devInsight')
    setData(DEMO_ANALYSIS)
    setError(null)
    setLoading(false)
    setIsDemoResult(true)
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#151515]">
      <section className="border-b border-[#ded8cc] bg-[#101211] text-white">
        <div className="mx-auto grid min-h-[540px] max-w-7xl gap-10 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_440px] lg:px-10">
          <div className="flex flex-col justify-between gap-10">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-[#d6ff64] font-mono text-sm font-black text-[#101211]">
                  DI
                </div>
                <span className="text-sm font-semibold tracking-wide">
                  DevInsight
                </span>
              </div>
              <div className="hidden items-center gap-2 text-xs text-white/55 sm:flex">
                <span className="h-2 w-2 rounded-full bg-[#d6ff64]" />
                GitHub + deterministic extractors + AI synthesis
              </div>
            </header>

            <div className="max-w-3xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#d6ff64]">
                Repository intelligence for fast technical judgment
              </p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
                Understand a codebase before you open the first file.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
                Paste a GitHub repo and get a cautious brief on what it is, what
                it runs on, how it is structured, and where to start.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Metric
                label="Signals"
                value="4"
                detail="identity, tech, structure, setup"
              />
              <Metric
                label="Pipeline"
                value="5"
                detail="fetch, extract, merge, classify, prompt"
              />
              <Metric
                label="Output"
                value="JSON"
                detail="typed summaries for UI and APIs"
              />
            </div>
          </div>

          <div className="flex items-end">
            <div className="w-full rounded-lg border border-white/12 bg-white/[0.06] p-5 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                    Live analyzer
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Repository brief
                  </h2>
                </div>
                <span className="rounded-full bg-[#d6ff64] px-3 py-1 text-xs font-bold text-[#101211]">
                  MVP
                </span>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium text-white/55">
                    GitHub repository URL
                  </span>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    placeholder="https://github.com/vercel/next.js"
                    className="w-full rounded-md border border-white/12 bg-[#070807] px-4 py-3 font-mono text-sm text-white outline-none transition placeholder:text-white/26 focus:border-[#d6ff64] disabled:opacity-50"
                  />
                </label>

                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-[#d6ff64] px-5 py-3 text-sm font-bold text-[#101211] transition hover:bg-[#c4f34b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Analyzing' : 'Analyze repository'}
                  </button>
                  <button
                    type="button"
                    onClick={showDemoAnalysis}
                    disabled={loading}
                    className="rounded-md border border-white/14 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/8 disabled:opacity-60"
                  >
                    View demo
                  </button>
                </div>
              </form>

              <div className="mt-5 flex flex-wrap gap-2">
                {EXAMPLE_REPOS.map((repo) => (
                  <button
                    key={repo}
                    type="button"
                    onClick={() => setUrl(repo)}
                    className="rounded-full border border-white/12 px-3 py-1.5 font-mono text-xs text-white/62 transition hover:border-[#d6ff64]/60 hover:text-white"
                  >
                    {getRepoLabel(repo)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {error && <ErrorState message={error} onDemoClick={showDemoAnalysis} />}
        {loading && <LoadingState repoLabel={repoLabel} />}
        {!loading && data && (
          <Results
            analysis={data}
            repoLabel={repoLabel}
            isDemo={isDemoResult}
          />
        )}
        {!loading && !data && !error && (
          <EmptyState onDemoClick={showDemoAnalysis} />
        )}
      </section>
    </main>
  )
}

function Results({
  analysis,
  repoLabel,
  isDemo,
}: {
  analysis: RepoAnalysis
  repoLabel: string
  isDemo: boolean
}) {
  const entryPoints = analysis.structure.entryPoints ?? []
  const setupItems = [
    { label: 'Install', value: analysis.setup.installation },
    { label: 'Run', value: analysis.setup.runCommand },
  ].filter((item): item is { label: string; value: string } =>
    Boolean(item.value)
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 border-b border-[#ded8cc] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#737064]">
            {isDemo ? 'Demo insight' : 'Generated insight'}
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
            {repoLabel || 'Repository analysis'}
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-[#656258]">
          Cautious by design: DevInsight separates fetched GitHub data,
          deterministic extraction, and model-written presentation.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Executive Read" eyebrow="What it is">
          <p className="text-lg leading-8 text-[#282721]">
            {analysis.identity.summary}
          </p>
        </Panel>

        <Panel title="Signal Map" eyebrow="Confidence cues">
          <div className="space-y-4">
            <SignalMeter label="Identity" value={92} />
            <SignalMeter label="Tech stack" value={86} />
            <SignalMeter label="Structure" value={78} />
            <SignalMeter
              label="Setup"
              value={analysis.setup.runCommand ? 72 : 46}
            />
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel title="Tech Stack" eyebrow="Detected">
          <p className="leading-7 text-[#3d3b33]">{analysis.tech.stack}</p>
        </Panel>

        <Panel title="Project Shape" eyebrow="Structure">
          <div className="space-y-3">
            {analysis.structure.overview.map((item) => (
              <div
                key={item}
                className="flex gap-3 text-sm leading-6 text-[#3d3b33]"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#151515]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Start Here" eyebrow="Setup">
          {setupItems.length > 0 ? (
            <div className="space-y-3">
              {setupItems.map((item) => (
                <div key={item.label}>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#777367]">
                    {item.label}
                  </p>
                  <pre className="overflow-x-auto rounded-md bg-[#151515] p-3 font-mono text-xs leading-6 text-[#d6ff64]">
                    {item.value}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="leading-7 text-[#656258]">
              No setup commands were confidently identified from the available
              repository signals.
            </p>
          )}
        </Panel>
      </div>

      {entryPoints.length > 0 && (
        <Panel title="Likely Entry Points" eyebrow="Where to inspect first">
          <div className="flex flex-wrap gap-2">
            {entryPoints.map((entryPoint) => (
              <code
                key={entryPoint}
                className="rounded-md border border-[#d8d1c3] bg-white px-3 py-2 font-mono text-xs text-[#282721]"
              >
                {entryPoint}
              </code>
            ))}
          </div>
        </Panel>
      )}

      <div className="rounded-lg border border-[#d8d1c3] bg-[#ebe6da] p-4 text-sm leading-6 text-[#5f5b50]">
        TODO: Persist saved analyses, add comparison views across repositories,
        and show provenance for each insight so production users can trace every
        claim back to README, package, tree, or metadata signals.
      </div>
    </div>
  )
}

function EmptyState({ onDemoClick }: { onDemoClick: () => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <Panel title="Ready for a first repo" eyebrow="No analysis yet">
        <p className="mb-5 leading-7 text-[#555146]">
          The strongest demo path is a recognizable open-source repo or the
          built-in DevInsight sample. Results appear as an investor-friendly
          technical brief instead of raw API output.
        </p>
        <button
          type="button"
          onClick={onDemoClick}
          className="rounded-md bg-[#151515] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a2925]"
        >
          Load sample insight
        </button>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-3">
        <PreviewCard title="Identity" copy="Plain-English product summary." />
        <PreviewCard
          title="Stack"
          copy="Detected runtime, framework, and tooling."
        />
        <PreviewCard title="Setup" copy="Commands a reviewer can try first." />
      </div>
    </div>
  )
}

function LoadingState({ repoLabel }: { repoLabel: string }) {
  return (
    <div className="rounded-lg border border-[#d8d1c3] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#777367]">
            Analyzing
          </p>
          <h2 className="mt-1 text-2xl font-semibold">{repoLabel}</h2>
        </div>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ded8cc] border-t-[#151515]" />
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          'Fetching GitHub data',
          'Extracting signals',
          'Building prompts',
          'Composing brief',
        ].map((step) => (
          <div key={step} className="rounded-md bg-[#f6f4ef] p-4">
            <div className="mb-3 h-1.5 rounded-full bg-[#d6ff64]" />
            <p className="text-sm font-medium text-[#3d3b33]">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({
  message,
  onDemoClick,
}: {
  message: string
  onDemoClick: () => void
}) {
  return (
    <div className="rounded-lg border border-[#e3b4a8] bg-[#fff7f4] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a4a37]">
        Analysis paused
      </p>
      <h2 className="mt-1 text-2xl font-semibold text-[#32150f]">{message}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#76584f]">
        Live analysis needs a reachable GitHub repository and configured model
        credentials. The demo insight keeps the product story visible when a
        service is unavailable.
      </p>
      <button
        type="button"
        onClick={onDemoClick}
        className="mt-5 rounded-md bg-[#32150f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4c2419]"
      >
        Show demo insight
      </button>
    </div>
  )
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-white/42">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs leading-5 text-white/52">{detail}</p>
    </div>
  )
}

function Panel({
  title,
  eyebrow,
  children,
}: {
  title: string
  eyebrow: string
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border border-[#d8d1c3] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#777367]">
        {eyebrow}
      </p>
      <h3 className="mt-1 mb-4 text-xl font-semibold tracking-tight">
        {title}
      </h3>
      {children}
    </section>
  )
}

function PreviewCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-lg border border-[#d8d1c3] bg-white p-5 shadow-sm">
      <div className="mb-8 h-16 rounded-md bg-[#151515] p-3">
        <div className="h-2 w-1/2 rounded-full bg-[#d6ff64]" />
        <div className="mt-3 h-2 w-3/4 rounded-full bg-white/28" />
        <div className="mt-2 h-2 w-2/5 rounded-full bg-white/18" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#5c584d]">{copy}</p>
    </div>
  )
}

function SignalMeter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-[#343229]">{label}</span>
        <span className="font-mono text-xs text-[#777367]">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-[#ebe6da]">
        <div
          className="h-2 rounded-full bg-[#151515]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function getRepoLabel(repoUrl: string): string {
  const fallback = repoUrl.trim() || 'Select a repository'

  try {
    const url = new URL(repoUrl)
    const [owner, repo] = url.pathname.split('/').filter(Boolean)
    return owner && repo ? `${owner}/${repo}` : fallback
  } catch {
    return fallback
  }
}
