# Architecture and structure

- frontend/src/main.tsx mounts App.tsx.
- App.tsx fetches /api/metrics through optional VITE_API_BASE_URL, then calls financial-utils.ts.
- components/dashboard holds header, KPI row/cards, income/outcome and profit charts. components/ui holds reusable card/skeleton primitives.
- backend/app/main.py configures FastAPI/CORS and includes routes.py. routes.py holds models, synthetic generator, filters, aggregation and endpoints.
- backend/tests and frontend/src/lib/*.test.ts cover route and calculation behavior.
- docker-compose.yml exposes frontend 5173 and backend 8000; Vite targets Docker service backend:8000. Debug port 5678 is also published.
- frontend/specs is reserved for spec artifacts; it must not contain React implementation or network calls.

Run: docker compose up --build. Check GET /health and /docs on backend. Frontend checks: npm test, npm run build. Backend: pytest from backend.
