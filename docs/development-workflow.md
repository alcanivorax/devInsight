# Development Workflow

## Prerequisites

- Node.js (modern LTS recommended)
- `pnpm`

## Install

```bash
pnpm install
```

This also runs `prepare` and installs Husky hooks.

## Run locally

```bash
pnpm dev
```

## Common commands

- Format:
  - `pnpm format`
  - `pnpm format:check`
- Lint:
  - `pnpm lint`
  - `pnpm lint:fix`
- Types:
  - `pnpm check-types`
- Tests:
  - `pnpm test`
- Build:
  - `pnpm build`

## Workspace notes

- Root project consumes `@devinsight/core` from `packages/core`.
- Core package exports source files directly (`packages/core/package.json` -> `"./src/index.ts"`).

## Typical feature workflow

1. Create branch.
2. Implement change in smallest relevant layer.
3. Run checks:
   - `pnpm format:check`
   - `pnpm lint`
   - `pnpm check-types`
   - `pnpm test`
4. Commit once checks are clean.

## Hooks

Current pre-commit hook runs:

- `pnpm format:check`
- `pnpm lint`

See `.husky/README.md` for details.
