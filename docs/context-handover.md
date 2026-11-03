# Verified handover

Source baseline: 954f812d6fb0d95af6699b369ca6e88089ece90c.

- ✅ React 19 + TypeScript + Vite 8 frontend: frontend/package.json; entry frontend/src/main.tsx and App.tsx.
- ✅ FastAPI backend: backend/app/main.py includes router from backend/app/routes.py.
- ✅ Dashboard loads /api/metrics; computes KPIs and monthly charts locally using frontend/src/lib/financial-utils.ts.
- ✅ Synthetic data: generate_mock_movements(seed=42) produces 360 sorted movements. No database or real bank integration is present.
- ✅ Docker Compose publishes frontend 5173, API 8000, debugger 5678; see docker-compose.yml. Start with docker compose up --build. Confirm /health and /docs on backend.
- ✅ Vite forwards /api to http://backend:8000 (frontend/vite.config.ts). Direct host runs need VITE_API_BASE_URL or an appropriate proxy; Docker service DNS is not host DNS.
- ❌ The header's hardcoded 2024 label describes the dataset: corrected. Backend data dates depend on date.today(); use facets min_date/max_date.
- ❌ Alerts use the previous three periods: corrected. detect_outcome_alerts averages all earlier summarized periods.
- ❓ Runtime behavior: pending Codespaces startup and live API verification.

No product behavior was changed during this inspection.
