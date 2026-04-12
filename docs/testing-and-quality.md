# Testing and Quality

## Current quality gates

Local scripts:

- `pnpm format:check` (Prettier)
- `pnpm lint` (ESLint)
- `pnpm check-types` (TypeScript)
- `pnpm test` (Vitest)

Pre-commit hooks currently run formatting and lint checks.

## Test placement

Core extraction tests are colocated in `packages/core/src/analyzer/extractors/*/*.test.ts`.

Examples:

- metadata extractor tests
- package-json extractor tests
- readme extractor tests
- tree signal/hints tests

## What to test when editing

- Extractor changes:
  - add/adjust deterministic unit tests in the same extractor folder.
- Schema or type contract changes:
  - verify dependent routes and pipeline compile.
- API route behavior changes:
  - validate response shape and error mapping consistency.

## Recommended verification sequence before PR

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
```

## Known practical constraint

Type-level compatibility between GitHub raw payloads and internal extractor schemas can drift quickly. When changing `packages/core/src/github/*`, verify all downstream extractor expectations and route usage in the same change.
