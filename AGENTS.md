# AGENTS.md — ai-for-developers-project-386

## Repo structure

```
calcomclone/
  main.tsp             # shared API contract (TypeSpec → OpenAPI)
  src/
    backend/           # .NET 10 minimal API  (see src/backend/AGENTS.md)
    frontend/          # Vue 3 + Vite SPA      (see src/frontend/AGENTS.md)
```

## Conventional Commits

All commits MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[(optional scope)]: <description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                              |
|-----------|------------------------------------------|
| `feat`    | New feature                              |
| `fix`     | Bug fix                                  |
| `docs`    | Documentation only                       |
| `style`   | Code style/formatting (no logic change)  |
| `refactor`| Code change that neither fixes nor adds  |
| `perf`    | Performance improvement                  |
| `test`    | Adding or updating tests                 |
| `chore`   | Build, tooling, CI, maintenance          |
| `ci`      | CI/CD configuration changes              |
| `build`   | Build system or dependencies             |

### Scope

Use the sub-project directory name as scope when applicable:
- `feat(frontend): add booking form`
- `fix(backend): resolve timezone offset`
- `chore(deps): update NuGet packages`
- `docs(readme): update setup instructions`

### Rules

1. Subject line **max 72 characters**, imperative mood, no period at the end
2. Body **optional**, wrapped at 72 chars, explains **what** and **why** (not how)
3. Footer **optional**, references issues (`Closes #123`, `Refs #456`)
4. Breaking changes: append `!` after type/scope or add `BREAKING CHANGE:` footer

**Examples:**
```
feat(frontend): add user registration page

Closes #42
```
```
fix(backend): handle null reference in event handler
```
```
feat(api)!: drop support for legacy auth tokens

BREAKING CHANGE: all clients must migrate to JWT-based auth
```

### Pre-commit checklist

Before committing, always:
- Run linting and type-checking for the modified project
- Verify no secrets or keys are staged
- Stage only intended files (check `git status` and `git diff`)

### Git workflow

Agent can prepare and stage commits autonomously, but MUST ask before
running destructive or remote operations.

| Operation          | Behavior                                      |
|--------------------|-----------------------------------------------|
| `git status`       | Allowed — check state anytime                 |
| `git diff`         | Allowed — review changes anytime              |
| `git log`          | Allowed — inspect history anytime             |
| `git add`          | Allowed — stage files for commit              |
| `git commit`       | **Ask first** — show the message and get OK   |
| `git push`         | **Ask first** — confirm branch and remote     |
| `gh pr create`     | **Ask first** — confirm title, body, base     |

When ready to commit:
1. Stage files with `git add`
2. Present the commit message (Conventional Commits format) and ask:
   > Ready to commit with message: `feat(frontend): add X`. OK?
3. On approval, run `git commit -m "..."` and `git push`
4. For PRs, draft title and body, then ask before `gh pr create`

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
