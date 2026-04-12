# AGENTS.md

Instructions for coding agents and automated contributors working in this repository.

## Goal

DevInsight analyzes GitHub repositories and returns structured, cautious summaries.

Priority order:

1. Correctness
2. Clear boundaries between layers
3. Small, reviewable changes

## Repository map

- Web app: `src/`
- API routes: `src/app/api/`
- Core analysis package: `packages/core/src/`
- Schemas: `packages/core/src/schemas/`
- GitHub fetch layer: `packages/core/src/github/`
- Analysis pipeline: `packages/core/src/analyzer/`

## Architectural boundaries

- `packages/core/src/github/*`
  - Fetch remote data from GitHub.
  - Keep request/error handling here.
  - Avoid mixing heavy business extraction logic into this layer.

- `packages/core/src/analyzer/extractors/*`
  - Convert raw fetched inputs into stable internal shapes.
  - Handle normalization and deterministic derivation.

- `packages/core/src/analyzer/context/*`
  - Build focused context objects for prompts/classification.

- `packages/core/src/analyzer/ai/*`
  - Prompt composition and model-facing orchestration.

When changing contracts between layers, update all dependent types and tests in the same PR.

## Local commands

Use root scripts:

- `pnpm dev`
- `pnpm lint`
- `pnpm check-types`
- `pnpm test`
- `pnpm format:check`

## Change policy

- Keep diffs minimal and reversible.
- Prefer fixing root cause over patching symptoms.
- Reuse existing utilities and patterns before introducing new helpers.
- Do not add dependencies unless essential.
- Do not silently change API/output shapes without updating callers.

## Testing and verification

Before concluding work, run (as applicable):

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
```

If any step is skipped, document why.

## Git and hooks

- Husky pre-commit runs:
  - `pnpm format:check`
  - `pnpm lint`
- Hook details live in `.husky/README.md`.

## Response expectations for agents

- Report concrete files changed.
- Report verification commands run and outcomes.
- Call out unresolved risks or follow-ups explicitly.
