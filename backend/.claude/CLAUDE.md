# Memory: MattheosMotorsBackend

## Project Identity

A motor vehicle backend system built with Clean Architecture .NET 10.0, using CQRS pattern with PostgreSQL database and MinIO storage.

## Core Business Domain

- **Car Attributes System** - Hierarchical categorization of vehicle specifications (engine, transmission, exterior, interior, etc.)
- **Supports 5 attribute types**: String, Number, Boolean, Color, List
- **Media-rich**: Images and icons for visual representation
- **Self-referencing hierarchy** for nested categories

## Current Implementation Status

- ✅ **CarAttributes CRUD** - Fully implemented with admin-only access
- ✅ **Authentication** - JWT-based with role-based authorization
- ✅ **File Storage** - MinIO integration for media assets
- 📋 **Template Features** - TodoItems/TodoLists present (likely for testing/demo)

## API Endpoints

- `/api/car-attributes` (GET/POST/PUT/DELETE) - Admin only
- `/api/todo-lists` - Authenticated users
- `/api/weather-forecasts` - Template endpoint
- `/health` - Health checks

## Technology Stack

- .NET 10.0, ASP.NET Core, Entity Framework Core, PostgreSQL
- MediatR (CQRS), **LINQ projections with `select`/`when`**, FluentValidation
- MinIO (storage), Azure Key Vault (secrets), NSwag (OpenAPI)

## Development Standards

- Clean Architecture with strict layer separation
- Single-line mediator pattern for endpoints
- Result<T> pattern for consistent API responses
- Centralized exception handling with predefined exception types
- All file operations through StorageService
- **❌ NO AutoMapper** - Use **LINQ `select`/`when`** for projections instead
- FluentValidation for all Commands/Queries (no DataAnnotations)

## Database & Migration Rules

- PostgreSQL with EF Core migrations
- Never modify migration folders manually
- Generate migrations from Infrastructure layer only
- Database updates via `dotnet ef database update -p src/Infrastructure -s src/Web`

## Exception Handling

- Only use predefined exceptions in `src/Web/Infrastructure/CustomExceptionHandler.cs`
- Sample: `throw new NotFoundException(nameof(TodoItem), request.Id.ToString());`
- No custom exceptions outside centralized handler

## Authentication & Authorization

- `IUser` and `IIdentityService` available in Application layer
- JWT-based authentication with role-based authorization

## Key Technical Decisions

- **Projections**: Use LINQ `select`/`when` instead of AutoMapper for better query performance
- **File Storage**: Mandatory MinIO StorageService usage (no raw I/O)
- **API Responses**: Consistent `Result<T>` pattern, never return raw entities

## Recent Changes (Current Git Status)

- **11 files added** related to CarAttributes feature
- **3 modified files** for integration (DbContext, IApplicationDbContext, CustomExceptionHandler)
- **1 file deleted** (NotFoundException - possibly consolidated or replaced)

## Build & Run Commands

```bash
# Build
dotnet build -tl

# Run (development with hot reload)
cd .\src\Web\
dotnet watch run

# Navigate to
https://localhost:5001

# Run tests
dotnet test

# Add migration
SkipNSwag=true dotnet ef migrations add "MigrationName" -p src/Infrastructure -s src/Web -o Data/Migrations

# Update database
dotnet ef database update -p src/Infrastructure -s src/Web
```

## Architecture Pattern

- Clean Architecture with 4-layered structure:
  - Domain - Core business logic and entities
  - Application - Use cases, CQRS (Commands/Queries), and application services
  - Infrastructure - External implementations (data access, storage, etc.)
  - Web - API presentation layer

## Code Scaffolding Template

Create new command:

```bash
dotnet new ca-usecase --name CreateTodoList --feature-name TodoLists --usecase-type command --return-type int
```

Create new query:

```bash
dotnet new ca-usecase -n GetTodos -fn TodoLists -ut query -rt TodosVm
```

## Project Status

The project is in **active development** with CarAttributes feature fully implemented and production-ready. The motor vehicle domain appears to be centered around **categorized car attributes** with hierarchical structure, supporting various data types and media assets, making it suitable for a vehicle specification, inventory, or dealership management system.
