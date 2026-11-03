# Evidence-derived engineering findings

| Area | Evidence | Rule to apply |
| --- | --- | --- |
| API contracts | backend/app/routes.py uses snake_case Pydantic models and Literal enums | Preserve wire names and enums; distinguish API payloads from display models. |
| Network | frontend/src/App.tsx uses VITE_API_BASE_URL, response.ok checks; vite.config.ts proxies /api to backend:8000 | Retain environment-aware URL handling and explicit failed-response states. |
| Data | routes.py generates 360 seed-42 synthetic movements using today's year/month | Never describe this as live accounting data; obtain bounds from facets. |
| Presentation | App.tsx derives KPIs and charts through financial-utils.ts | Keep transformations pure and outside presentational components. |
| Tests | backend/tests/test_routes.py and frontend/src/lib/financial-utils.test.ts | Run pytest for backend behavior and npm test for financial transformations; use npm run build for frontend typing. |
| Types | frontend/tsconfig.app.json includes src only | A separate specs tsconfig must include frontend/specs/*.ts to actually check deliverables. Root tsc --noEmit alone can miss them. |
| Semantics | detect_outcome_alerts averages all previous summarized outcomes | Do not label API baseline as a three-period rolling average. |
| Documentation | root AGENTS.md directs agents to .agents/rules, .agents/skills, memory-bank | Maintain those locations; read them before edits. |

No database, authentication, or production financial-data integration was found in the inspected repository.
