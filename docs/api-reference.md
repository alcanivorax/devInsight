# API Reference

All endpoints are under `src/app/api`.

## Common query parameter

- `repo` (required): repository input accepted by `parseRepoInput`.
  - Typical format: `owner/repo`
  - URL form is also supported by parser logic in core utils.

## `GET /api/analyze`

Primary endpoint for end-to-end analysis.

Response:

- `200`:
  - `{ success: true, data: <assembled analysis> }`
- Errors:
  - handled by `handleApiError` with standardized payload

Implementation: `src/app/api/analyze/route.ts`.

## `GET /api/readme`

Fetches README and extracted README info.

Response:

- `200`:
  - `{ owner, repo, readme, info }`
- `404`:
  - when repository or README is missing

Implementation: `src/app/api/readme/route.ts`.

## `GET /api/package-json`

Fetches parsed/validated `package.json` data from the repository.

Response:

- `200`:
  - `{ owner, repo, packageJson }`

Implementation: `src/app/api/package-json/route.ts`.

## `GET /api/tree`

Fetches repository tree signal source.

Response:

- `200`:
  - `{ owner, repo, tree }`

Implementation: `src/app/api/tree/route.ts`.

## `GET /api/metadata`

Fetches repository metadata and language stats.

Response:

- `200`:
  - `{ owner, repo, metadata, language }`

Implementation: `src/app/api/metadata/route.ts`.

## `GET/POST /api/auth/[...all]`

Delegated to Better Auth Next.js handler.

Implementation: `src/app/api/auth/[...all]/route.ts`.

## `POST /api/language`

Currently a placeholder route returning `{}`.

Implementation: `src/app/api/language/route.ts`.

## Error payload shape

Errors are normalized in `packages/core/src/error/error-handler.ts`:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "timestamp": "ISO timestamp",
    "details": {},
    "stack": "development only"
  }
}
```
