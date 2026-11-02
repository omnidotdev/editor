---
"@omnidotdev/editor": patch
---

Build with the production automatic JSX runtime. The bundle previously shipped the development runtime (literal `jsxDEV` calls and a `react/jsx-dev-runtime` import), which threw `TypeError: jsxDEV is not a function` in any consumer's production build (React's production `jsx-dev-runtime` leaves `jsxDEV` undefined) and took down every view that rendered the editor. The build now sets `NODE_ENV=production` so Bun emits `jsx`/`jsxs`, and consumers can drop their build-time `jsx-dev-runtime` shims.
