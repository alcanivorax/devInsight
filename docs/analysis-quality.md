# Analysis Quality

DevInsight should feel useful because it explains a repository from evidence, not
because it generates polished generic text.

## Evidence Sources

Current analysis uses:

- GitHub repository metadata
- README content
- root `package.json`
- recursive repository tree paths
- deterministic feature, dependency, architecture, and complexity signals
- LLM synthesis over the focused context

## Output Standard

Good output should:

- mention concrete paths, scripts, dependencies, and detected features
- separate explicit evidence from cautious inference
- explain why a dependency or file matters
- help a developer decide where to start reading
- call out missing or uncertain signals instead of pretending certainty

Weak output should be improved when it:

- could apply to thousands of unrelated repositories
- repeats README copy without adding technical orientation
- lists dependencies without explaining their roles
- invents behavior not supported by extracted context
- hides important setup, test, API, auth, database, or CI signals

## Production TODOs

- Attach source provenance to every major claim.
- Fetch a small set of high-signal files and summarize their contracts.
- Cache analyses by repository and commit SHA.
- Add regression fixtures for known repositories and expected insight quality.
- Support partial results when one model section fails.
