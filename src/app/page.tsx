"use client";

import { useState } from "react";

export default function Page() {
  const [repoInput, setRepoInput] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!repoInput) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `/api/readme?repo=${encodeURIComponent(repoInput)}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const json = await res.json();

      setData(json);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-6">
      <h1 className="text-2xl font-semibold">DevInsight</h1>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="vercel/next.js or GitHub URL"
          value={repoInput}
          onChange={(e) => setRepoInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="border px-4 py-2 rounded text-sm"
        >
          {loading ? "Loading..." : "Analyze"}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-600 dark:text-black">{error}</p>}

      {/* Result */}
      {/* {data && (
        <section className="space-y-2">
          <p className="text-sm text-white bg-gray-900">
            {data.owner}/{data.repo}
          </p>

          <ul className="border rounded divide-y">
            {data.tree.map((item: any) => (
              <li
                key={item.path}
                className="flex justify-between px-3 py-2 text-sm"
              >
                <span>{item.path}</span>
                <span className="opacity-60">{item.type}</span>
              </li>
            ))}
          </ul>
        </section>
      )} */}
    </main>
  );
}
1;
