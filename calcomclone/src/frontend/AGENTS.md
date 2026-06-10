# AGENTS.md — calcomclone frontend

## Working directory

All commands assume you are in `calcomclone/src/frontend/`.

## Architecture

- **Vue 3 + Vite 8** SPA with **TypeScript 6**, **Pinia** state, **vue-router**, **Tailwind CSS v4**.
- **shadcn-vue** UI library (new-york style, neutral base). Components live in `src/components/ui/`. Use `cn()` from `src/lib/utils.ts` for class merging.
- **`@/`** alias maps to `src/`.
- Backend API is specified in **TypeSpec** at `calcomclone/main.tsp` (generates OpenAPI schema). Use `@stoplight/prism-cli` to mock the API locally.

## Commands

```sh
npm run dev          # dev server at http://localhost:5173
npm run build        # type-check + vite build (parallel)
npm run test:unit    # vitest (jsdom environment)
npm run test:e2e     # playwright (auto-starts dev server)
npm run type-check   # vue-tsc --build (NOT plain tsc)
npm run lint         # oxlint → eslint (runs both sequentially)
npm run format       # prettier
```

## Testing details

- Unit tests go in `src/**/__tests__/*.spec.ts` (Vitest + @vue/test-utils, jsdom).
- E2E tests go in `e2e/` (Playwright).
- E2E base URL: `http://localhost:5173` (dev) or `http://localhost:4173` (CI/preview).
- Playwright auto-manages the web server; no need to start it manually.

## Code style

- **No semicolons**, **single quotes**, **100 char** print width (prettier).
- LF line endings, 2-space indent, trailing whitespace trimmed, final newline.
- Type-check with `vue-tsc --build`, not `tsc`. TypeScript cannot natively handle `.vue` files.
- `noUncheckedIndexedAccess: true` in `tsconfig.app.json`.

## Lint/tooling notes

- **oxlint** runs first (correctness errors only), then **eslint**. Both must pass.
- ESLint config is in `eslint.config.ts` (flat config format).
- Oxlint config: `.oxlintrc.json`.
- Formatting is handled by prettier, not eslint (`eslint-config-prettier` disables formatting rules).
