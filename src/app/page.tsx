"use client";

import { useState } from "react";

interface RepoAnalysis {
  summary: string;
  architecture: string;
  setupGuide: string[];
}

export default function HomePage() {
  const [repo, setRepo] = useState("");
  const [data, setData] = useState<RepoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyzeRepo() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/analyze?repo=${encodeURIComponent(repo)}`);

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error ?? "Failed to analyze repo");
      }

      setData(json.data);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-semibold">DevInsight</h1>

      <div className="flex gap-2">
        <input
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="https://github.com/owner/repo"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={analyzeRepo}
          disabled={loading}
          className="border px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {data && (
        <section className="space-y-6">
          {/* Summary */}
          <div>
            <h2 className="text-xl font-medium mb-2">Summary</h2>
            <p className="text-white">{data.summary}</p>
          </div>

          {/* Architecture */}
          <div>
            <h3 className="font-medium mb-2">Architecture</h3>
            <p className="text-sm text-white whitespace-pre-wrap">
              {data.architecture}
            </p>
          </div>

          {/* Setup Guide */}
          <div>
            <h3 className="font-medium mb-2">Setup Guide</h3>
            {data.setupGuide.length > 0 ? (
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {data.setupGuide.map((step, index) => (
                  <li key={index} className="text-white">
                    {step}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-neutral-600">
                No setup instructions found.
              </p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
