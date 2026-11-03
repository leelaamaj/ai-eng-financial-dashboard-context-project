# Rule validation task

Task: document the anomaly contract and dashboard date source without changing runtime code.

Applied rules: inspect backend/app/routes.py and frontend/src/App.tsx; preserve field names and distinguish display labels from API semantics.

Verified result: alerts return a bare array with period, outcome_total, baseline_average and increase_ratio. baseline_average is the mean of all earlier populated periods, not a fixed three-period window. Facets supplies min_date/max_date; the static 2024 header is not reliable. These corrections appear in docs/context-handover.md.

Review: no proposed new endpoint, guessed date bounds or runtime change was needed. Rule 7 was refined to require a dedicated specs TypeScript configuration after tsconfig.app.json was found to exclude specs.
