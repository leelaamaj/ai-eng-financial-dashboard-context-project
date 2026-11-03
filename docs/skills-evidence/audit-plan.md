# Skill-led audit and proposed changes

The two module practices completed their reviewed reflections and quizzes. The custom SKILL.md exercise passed all three rubric checks.

## Sources loaded
- accessibility: addyosmani/web-quality-skills/skills/accessibility/SKILL.md. Applies text alternatives, semantics, focus visibility, status/error announcements, contrast and motion guidance.
- vercel-react-best-practices: vercel-labs/agent-skills/skills/react-best-practices/SKILL.md plus bundle-conditional and bundle-dynamic-imports rules.
- seo: addyosmani/web-quality-skills/skills/seo/SKILL.md. Chosen after ecosystem discovery because frontend/index.html has generic title frontend and no description.
Discovery commands covered accessibility, vercel-react-best-practices, testing, performance and seo. Raw command outputs are retained alongside installed skill snapshots and skills-lock.json.

## File-grounded proposals and accepted scope
1. Charts: income-outcome-chart.tsx and profit-percent-chart.tsx expose hover-driven visuals without a complete readable data alternative. Add native details/table, real h2 headings, and mark decorative icons hidden. Preserve chart values and layout.
2. App.tsx: announce loading/success and API errors; match English page language; provide skip link and main target. Remove misleading static 2024 label.
3. index.css: improve dark muted text contrast, visible focus, reduced motion, forced-colors boundaries.
4. App.tsx eagerly imports Recharts through two chart modules. Apply conditional module loading via React.lazy/Suspense after data becomes available, with reserved skeleton dimensions. Baseline build reported 584.26 kB main JS (175.20 kB gzip) and a >500 kB warning. Preserve actual package/framework: Vite React, not Next.js. next/image and next/font are inapplicable; no raster hero or custom font is loaded in this view.
5. index.html: accurate title and description following seo skill. No production canonical URL or ranking/indexing outcomes are invented.
6. Internal skill: dashboard-quality-gate captures this repo's API/Compose/QA traps and expected evidence, which generic community guidance cannot know.

## Verification plan
Run build, existing tests, lint, explicit specs types. Inspect rendered app and keyboard disclosures; run Lighthouse accessibility/SEO when tooling is available. Record limitations without declaring generic WCAG compliance. No backend changes or deployment required.
