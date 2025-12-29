"use client";
import { useState } from "react";

interface RepoAnalysis {
  identity: {
    summary: string;
  };
  tech: {
    stack: string;
  };
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
  const [error, setError] = useState("");

  async function handleFetch() {
    if (!url.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(
        `/api/analyze?repo=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to analyze: ${response.statusText}`);
      }

      const json = await response.json();

      if (json.error) {
        throw new Error(json.error);
      }

      setData(json.data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze repository");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: any) {
    if (e.key === "Enter" && !loading) {
      handleFetch();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">DevInsight</h1>
          <p className="mb-1 text-slate-600">
            A cautious repository analyzer that prefers being incomplete over
            being wrong.
          </p>
        </div>

        {/* Input */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://github.com/owner/repository"
            disabled={loading}
            className="flex-1 rounded-md border border-slate-300 bg-white text-black px-4 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:opacity-50 dark:text-black"
          />
          <button
            onClick={handleFetch}
            disabled={loading}
            className="rounded-md bg-slate-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze →"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
            <p className="text-slate-600">Analyzing repository...</p>
          </div>
        )}

        {/* Preview */}
        {!loading && data && (
          <div className="space-y-4">
            {/* Identity */}
            <InfoCard title="Identity" content={data.identity.summary} />

            {/* Tech Stack */}
            <InfoCard title="Tech Stack" content={data.tech.stack} />

            {/* Structure */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Structure
              </h3>
              {data.structure.overview.length > 0 && (
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-slate-700">
                    Overview
                  </h4>
                  <ul className="space-y-2">
                    {data.structure.overview.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-600">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.structure.entryPoints &&
                data.structure.entryPoints.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-slate-700">
                      Entry Points
                    </h4>
                    <ul className="space-y-2">
                      {data.structure.entryPoints.map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-slate-600"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400"></span>
                          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                            {item}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            {/* Setup */}
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">
                Setup
              </h3>
              {data.setup.installation ? (
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-slate-700">
                    Installation
                  </h4>
                  <code className="block rounded bg-slate-900 px-4 py-2 font-mono text-sm text-slate-100">
                    {data.setup.installation}
                  </code>
                </div>
              ) : (
                <p className="mb-4 text-sm text-slate-500">
                  No installation command found
                </p>
              )}
              {data.setup.runCommand && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-slate-700">
                    Run Command
                  </h4>
                  <code className="block rounded bg-slate-900 px-4 py-2 font-mono text-sm text-slate-100">
                    {data.setup.runCommand}
                  </code>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !data && !error && (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg
                className="h-8 w-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-medium text-slate-900">
              Ready to analyze
            </h3>
            <p className="text-sm text-slate-500">
              Enter a GitHub repository URL above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-700">{content}</p>
    </div>
  );
}
