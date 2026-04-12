# Husky Hooks

This project uses [Husky](https://typicode.github.io/husky/) to run lightweight checks before commits.

## Active hook

- `pre-commit`
  - `pnpm format:check`
  - `pnpm lint`

These checks are intentionally fast and deterministic. They protect formatting and lint quality at commit time.

## How hooks are installed

- Hooks are installed by the root `prepare` script:
  - `pnpm prepare`
  - This runs automatically during `pnpm install`.

## Local usage

- Run all current pre-commit checks manually:

```bash
pnpm format:check
pnpm lint
```

- Bypass hooks once (not recommended except emergencies):

```bash
git commit --no-verify
```

## Adding a new hook

1. Create a file in `.husky/` named after the Git hook (`pre-push`, `commit-msg`, etc.).
2. Add only fast checks to local hooks; keep long-running checks for CI.
3. Keep scripts shell-safe and cross-platform (avoid bash-only features).

Example:

```sh
# .husky/pre-push
pnpm test
```

## Notes

- `.husky/_/` is Husky-managed internal scaffolding. Do not edit files there manually.
- If hooks stop running, reinstall:

```bash
pnpm prepare
```
