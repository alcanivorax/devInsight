# DevInsight

DevInsight analyzes a GitHub repository and returns structured insights about:

- repository identity
- tech stack signals
- project structure
- setup guidance

## Stack

- Next.js
- TypeScript
- `pnpm` workspace
- Octokit (GitHub API)
- Zod
- OpenRouter (LLM calls)

## Quick Start

1. Clone the repo:

```bash
git clone https://github.com/alcanivorax/devInsight
cd devInsight
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment:

```bash
cp .env.example .env
```

4. Run locally:

```bash
pnpm dev
```

## Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`
- `pnpm check-types`
- `pnpm test`
- `pnpm format`
- `pnpm format:check`

## API Routes

- `GET /api/analyze`
- `GET /api/readme`
- `GET /api/package-json`
- `GET /api/tree`
- `GET /api/metadata`

## Documentation

See [`docs/README.md`](docs/README.md) for detailed docs:

- architecture
- API reference
- environment variables
- development workflow
- testing and quality

## Contributing

- Keep changes small and focused.
- Run `pnpm format:check`, `pnpm lint`, `pnpm check-types`, and `pnpm test` before opening a PR.

## License

MIT
