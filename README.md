# DevInsight

DevInsight analyzes a public GitHub repository and turns raw repository signals
into a structured technical brief. It is built for quick codebase orientation:
what the project is, what technologies matter, how it is structured, how to run
it, and where a developer should start reading.

## What It Produces

- Repository identity and likely audience
- Technology stack and important dependency signals
- Architecture, feature, and complexity signals from the repository tree
- Setup and run guidance from README/package scripts
- Developer onboarding recommendations with concrete files and directories

## Stack

- Next.js app router
- TypeScript + pnpm workspace
- Octokit for GitHub API access
- OpenRouter for model calls
- Zod-style validation and typed API errors

## Quick Start

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Then open the local Next.js URL and analyze a repository such as:

```text
https://github.com/fastify/fastify
```

## Environment

Set these values in `.env`:

- `GITHUB_TOKEN` - GitHub token for repository metadata, README, package, and tree fetches.
- `OPENROUTER_API_KEY` - OpenRouter API key for LLM analysis.
- `OPENROUTER_MODEL` - model id used for analysis prompts.

Auth/database variables are only required when working on auth-related routes.
See [docs/environment.md](docs/environment.md).

## Main Commands

```bash
pnpm dev
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
```

## Architecture

The app keeps transport and analysis separate:

- `src/app/api/*` handles HTTP routes.
- `packages/core/src/github/*` fetches GitHub data.
- `packages/core/src/analyzer/analyzeRepository.ts` owns the repository analysis pipeline.
- `packages/core/src/analyzer/extractors/*` derives deterministic signals.
- `packages/core/src/analyzer/context/*` builds model context.
- `packages/core/src/analyzer/ai/*` builds prompts and runs model calls.
- `packages/core/src/analyzer/assemble/*` validates final structured output.

More detail lives in [docs/README.md](docs/README.md).

## Current MVP Limits

- Claims do not yet include clickable source provenance.
- The analyzer mostly uses README, package metadata, repo metadata, and tree paths.
- It does not yet fetch and summarize important source files.
- Model output depends on valid OpenRouter configuration and JSON-compliant responses.

## License

MIT
