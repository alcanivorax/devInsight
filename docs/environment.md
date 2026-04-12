# Environment Variables

Use `.env.example` as the baseline and copy to `.env`.

```bash
cp .env.example .env
```

## Required for GitHub analysis

- `GITHUB_TOKEN`
  - GitHub token used by Octokit.
  - Needed by `packages/core/src/github/client.ts`.

## Runtime

- `NODE_ENV`
  - `development` or `production`.
  - Also controls stack/error detail exposure in `handleApiError`.

## LLM provider

- `OPENROUTER_API_KEY`
  - API key for OpenRouter requests.

- `OPENROUTER_MODEL`
  - Model id used for analysis prompting.

## Auth + database (used by Better Auth + Prisma)

Values referenced in `src/lib/auth.ts`:

- `DATABASE_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

If any of these are missing, auth/database features will fail at runtime.

## Practical setup checklist

1. Copy env file.
2. Set `GITHUB_TOKEN` first (needed for analysis APIs).
3. Set OpenRouter keys for AI responses.
4. Set auth/database env vars if using login/auth endpoints.
