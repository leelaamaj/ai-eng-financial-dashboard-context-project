# Project workflow rules

Scope: all work in this repository.

1. Read AGENTS.md, .agents/rules and memory-bank before changes; review available .agents/skills if present. Root AGENTS.md establishes these discovery paths.
2. Preserve existing React/TypeScript frontend and FastAPI backend boundaries (frontend/package.json; backend/app/main.py). Do not add a framework or data service without a requirement.
3. Verify request parameters and snake_case fields against running /docs and routes.py. Preserve enum spellings. Record unsupported requirements rather than inventing endpoints.
4. Retain VITE_API_BASE_URL and explicit response.ok handling from App.tsx. Docker's backend hostname in vite.config.ts is specific to Compose networking.
5. Derive date bounds from /api/metrics/facets. routes.py generates relative-date synthetic data; the hardcoded App.tsx header is not authoritative.
6. Keep calculations in pure utilities, consistent with financial-utils.ts. Specify ratio-to-percent conversion explicitly; never treat increase_ratio as a percentage already.
7. For documentation/spec tasks, do not edit runtime components, fetch logic or backend behavior. Include specs in a dedicated strict TypeScript check because tsconfig.app.json includes only src.
8. Use separate meaningful commits for each assignment phase. Record checks actually executed and remaining blockers in memory-bank/progress.md.

Rationale and exact file evidence: docs/engineering-findings.md.
