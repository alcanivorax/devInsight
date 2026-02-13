"use client";

import type { KeyboardEvent } from "react";
import { useState } from "react";

interface RepoAnalysis {
  identity: { summary: string };
  tech: { stack: string };
  structure: {
    overview: string[];
    entryPoints?: string[];
  };
  setup: {
    installation: string | null;
    runCommand?: string | null;
  };
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<RepoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyzeRepo() {
    if (!url.trim()) {
      setError("Enter a GitHub repository URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/analyze?repo=${encodeURIComponent(url)}`);

      if (!res.ok) {
        throw new Error("Analysis failed.");
      }

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      setData(json.data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !loading) analyzeRepo();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-semibold tracking-tight text-slate-200">
            dev<span className="text-slate-600">Insight</span>
          </h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Understand any GitHub repository in minutes.
          </p>
        </header>

        {/* Input */}
        <section className="mb-8 mx-auto max-w-2xl">
          <div className="rounded-lg border border-slate-800 bg-[#111111] p-6">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={loading}
              placeholder="Paste a GitHub repository URL…"
              className="mb-4 w-full bg-transparent font-mono text-sm text-slate-300 placeholder-slate-600 outline-none disabled:opacity-50"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-600">
                Press Enter
              </span>

              <button
                onClick={analyzeRepo}
                disabled={loading}
                className="rounded bg-slate-600 px-6 py-2.5 text-sm font-semibold text-black hover:bg-slate-500 disabled:opacity-50"
              >
                {loading ? "Analyzing…" : "Analyze"}
              </button>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="mx-auto mb-6 max-w-2xl rounded-lg border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mx-auto max-w-2xl rounded-lg border border-slate-800 bg-[#111111] p-12 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-slate-300" />
            <p className="font-mono text-sm text-slate-400">
              Analyzing repository…
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && data && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FeatureCard
              icon="🔍"
              title="Overview"
              content={data.identity.summary}
            />

            <FeatureCard
              icon="⚡"
              title="Tech Stack"
              content={data.tech.stack}
            />

            <Section title="Project Structure" icon="📁">
              {data.structure.overview.map((item, i) => (
                <div key={i} className="flex gap-2 text-sm text-slate-300">
                  <span className="font-mono text-slate-600">▸</span>
                  {item}
                </div>
              ))}

              {data.structure.entryPoints && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.structure.entryPoints.map((e, i) => (
                    <code
                      key={i}
                      className="rounded border border-slate-800 bg-slate-900 px-3 py-1.5 font-mono text-xs text-slate-300"
                    >
                      {e}
                    </code>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Setup" icon="⚙️">
              <p>Installation Guide:</p>
              {data.setup.installation ? (
                <pre className="mb-4 rounded border border-slate-900 bg-black p-4 font-mono text-sm text-slate-300">
                  {data.setup.installation}
                </pre>
              ) : (
                <p className="mb-4 font-mono text-sm text-slate-300">
                  No installation command found.
                </p>
              )}
              <p>Run Command: </p>
              {data.setup.runCommand && (
                <pre className="rounded border border-slate-900 bg-black p-4 font-mono text-sm text-slate-300">
                  {data.setup.runCommand}
                </pre>
              )}
            </Section>
          </div>
        )}

        {/* Empty */}
        {!loading && !data && !error && (
          <div className="mx-auto max-w-2xl rounded-lg border border-slate-800 bg-[#111111] p-16 text-center">
            <h3 className="mb-2 text-lg font-semibold text-slate-300">
              Ready when you are
            </h3>
            <p className="font-mono text-sm text-slate-500">
              Paste a GitHub repository URL to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Small UI Primitives ---------- */

function FeatureCard({
  icon,
  title,
  content,
}: {
  icon: string;
  title: string;
  content: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#111111] p-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <h3 className="text-base font-semibold text-slate-300">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-slate-300">{content}</p>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="md:col-span-2 rounded-lg border border-slate-800 bg-[#111111] p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <h3 className="text-base font-semibold text-slate-300">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
