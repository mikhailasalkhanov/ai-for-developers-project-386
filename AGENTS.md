# AGENTS.md — ai-for-developers-project-386

## Repo structure

```
calcomclone/
  main.tsp             # shared API contract (TypeSpec → OpenAPI)
  src/
    backend/           # .NET 10 minimal API  (see src/backend/AGENTS.md)
    frontend/          # Vue 3 + Vite SPA      (see src/frontend/AGENTS.md)
```

## Shared API contract

Both frontend and backend consume the API contract defined in `calcomclone/main.tsp`. After editing it, regenerate the OpenAPI schema from the `calcomclone/` directory:

```sh
npx tsp compile .
```

Output goes to `calcomclone/tsp-output/schema/` (git-ignored).

## Sub-project docs

Detailed commands, architecture notes, and conventions live in each project's own `AGENTS.md`:
- `calcomclone/src/backend/AGENTS.md`
- `calcomclone/src/frontend/AGENTS.md`
