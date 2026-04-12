# Architecture

## Overview

DevInsight is a Next.js app that analyzes GitHub repositories through a layered pipeline.

High-level layers:

1. API routes (`src/app/api/*`) receive requests and orchestrate flow.
2. Core package (`packages/core/src`) performs fetching, extraction, classification, and prompt assembly.
3. AI assembly (`packages/core/src/analyzer/ai` + `assemble`) produces validated structured output.

## Monorepo structure

- `src/`: Next.js application
- `packages/core/src/`: shared core analysis logic
- `prisma/`: Prisma schema and generation config
- `docs/`: project documentation

`pnpm-workspace.yaml` includes `packages/*`, with `@devinsight/core` consumed by the app.

## Request flow (`/api/analyze`)

`src/app/api/analyze/route.ts`:

1. Parse `repo` query param.
2. Fetch repository data (`getRepoData`).
3. Extract deterministic signals from readme/metadata/tree/package.
4. Merge and classify signals.
5. Build focused prompt contexts.
6. Run AI assembly and return final response.

## Core module boundaries

Inside `packages/core/src`:

- `github/*`: GitHub fetch layer (API I/O and request handling)
- `analyzer/extractors/*`: deterministic signal extraction
- `analyzer/merge/*`: merge heuristics for related signals
- `analyzer/classify/*`: repo type classification
- `analyzer/resolve/*`: structural/command resolution
- `analyzer/context/*`: context objects for prompting
- `analyzer/ai/*`: prompt execution
- `analyzer/assemble/*`: output assembly and validation
- `schemas/*`: zod schemas and inferred types
- `error/*`: typed API error handling utilities

## Data model notes

- The app currently relies on strict `null` handling for missing resources (`readme`, `metadata`, `pkg`, `tree`).
- Errors are normalized through `handleApiError` in `packages/core/src/error/error-handler.ts`.
- Public route responses return JSON with either data or standardized error payloads.
