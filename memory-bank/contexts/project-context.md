# Project context

Financial metrics dashboard for synthetic income/outcome analysis. React frontend loads FastAPI movement records and derives KPI totals and monthly charts. Source: frontend/src/App.tsx, lib/financial-utils.ts; backend/app/routes.py.

Stack: React 19, TypeScript 6, Vite 8, Tailwind 4, Recharts 3; FastAPI, Pydantic, Uvicorn; Docker Compose; Vitest and pytest. Evidence: frontend/package.json, backend/requirements.txt, docker-compose.yml.

Data: 360 synthetic seed-42 movements; dates depend on server date. Category, operation and business line are Literal unions. No persisted database is present.
