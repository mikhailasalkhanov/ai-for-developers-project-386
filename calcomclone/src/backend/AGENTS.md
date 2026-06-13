# AGENTS.md — calcomclone backend

## Working directory

All commands assume you are in `calcomclone/src/backend/`.

## Architecture

- **.NET 10** ASP.NET Core, hexagonal (ports & adapters) architecture with 4 projects.
- Solution file uses the new `.slnx` XML format (not `.sln`).
- The API contract lives in **TypeSpec** at `calcomclone/main.tsp` (generates OpenAPI 3.1 schema to `tsp-output/schema/`).

### Layer responsibilities

| Project | Role |
|---|---|
| `CalComClone.Core` | Domain layer — models and interfaces (no dependencies) |
| `CalComClone.UseCases` | Application layer — use cases / service logic |
| `CalComClone.Infrastructure` | Adapter layer — repositories, data access DTOs, external integrations |
| `CalComClone.WebApi` | Entry point — controllers, HTTP request/response DTOs, DI wiring, `Program.cs` |

Dependency direction: WebApi → UseCases → Core, and WebApi → Infrastructure → Core.
All project references are wired. In-memory repositories are registered as singletons.

## Commands

```sh
# Run the dev server (HTTP: http://localhost:5094, HTTPS: https://localhost:7179)
dotnet run --project CalComClone.WebApi/CalComClone.WebApi.csproj

# Build the whole solution
dotnet build

# Run tests (no test project exists yet — add one with `dotnet new xunit`)
dotnet test

# Generate OpenAPI schema from TypeSpec (run from calcomclone root)
npx tsp compile .
```

## Key files

- `CalComClone.WebApi/Program.cs` — startup, DI, middleware, `AddControllers`.
- `CalComClone.WebApi/Controllers/` — HTTP controllers mapped to the TypeSpec contract.
- `CalComClone.WebApi/Responses/` — HTTP request/response DTOs and error models.
- `CalComClone.WebApi/CalComClone.http` — REST client file for manual smoke tests (base URL: `http://localhost:5094`).
- `CalComClone.WebApi/Properties/launchSettings.json` — launch profiles.
- `CalComClone.slnx` — solution file; add new projects here.
- `CalComClone.Core/Interfaces/` — domain contracts (repositories, services).
- `CalComClone.Core/Models/` — domain entities.
- `CalComClone.Infrastructure/Repositories/` — data access implementations.
- `CalComClone.Infrastructure/Dto/` — data access DTOs (internal to infrastructure).

## API design workflow

1. Edit `calcomclone/main.tsp` to update the API contract.
2. Run `npx tsp compile .` from `calcomclone/` root to regenerate OpenAPI schema.
3. Implement endpoints in WebApi controllers, wire through UseCases and Infrastructure.
4. Use `CalComClone.http` to smoke-test endpoints manually.

## Scaffold status

All layers are implemented end-to-end with in-memory storage. 3 repository implementations (InMemoryOwnerSettingsRepository, InMemoryEventTypeRepository with seed data, InMemoryBookingRepository) and 4 use cases (OwnerSettingsService, EventTypeService, BookingService, SlotService). All wired via DI in Program.cs. The app runs and all endpoints return real data. No database or ORM is configured.
