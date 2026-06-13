# AGENTS.md — calcomclone backend

## Working directory

All commands assume you are in `calcomclone/src/backend/`.

## Architecture

- **.NET 10** minimal API (ASP.NET Core), single project `CalComClone`.
- Solution file uses the new `.slnx` XML format (not `.sln`).
- The API contract lives in **TypeSpec** at `calcomclone/main.tsp` (generates OpenAPI 3.1 schema to `tsp-output/schema/`).
- No database or ORM configured yet — the project is a starting scaffold.

## Commands

```sh
# Run the dev server (HTTP: http://localhost:5094, HTTPS: https://localhost:7179)
dotnet run --project CalComClone/CalComClone.csproj

# Build
dotnet build

# Run tests (no test project exists yet — add one with `dotnet new xunit`)
dotnet test

# Generate OpenAPI schema from TypeSpec (run from calcomclone root)
npx tsp compile .
```

## Key files

- `CalComClone/Program.cs` — single file, minimal API; all endpoints and services are registered here.
- `CalComClone/CalComClone.http` — JetBrains/VS Code REST client file for manual endpoint testing (base URL: `http://localhost:5094`).
- `CalComClone/Properties/launchSettings.json` — launch profiles (HTTP/HTTPS).
- `CalComClone.slnx` — solution file; add new projects here.

## API design workflow

1. Edit `calcomclone/main.tsp` to update the API contract.
2. Run `npx tsp compile .` from `calcomclone/` root to regenerate OpenAPI schema.
3. Implement endpoints in `Program.cs` matching the TypeSpec definitions.
4. Use `CalComClone.http` to smoke-test endpoints manually.

The current `Program.cs` has a sample `/weatherforecast` endpoint that should be replaced with real endpoints matching the TypeSpec contract (admin settings, event types, bookings, public event types/slots/bookings).
