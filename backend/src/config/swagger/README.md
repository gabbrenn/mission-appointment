# Swagger Documentation Structure

## Modular Organization

```
src/config/swagger/
├── schemas/
│   ├── index.ts              # Central export point
│   ├── common.schema.ts      # Shared schemas (Error, Success, etc.)
│   ├── user.schema.ts        # User-related schemas
│   ├── department.schema.ts  # Department schemas
│   └── missionType.schema.ts # Mission type schemas
└── swagger.ts                # Main config (imports from schemas/)
```

## Adding New Schemas

### 1. Create a new schema file:
```typescript
// src/config/swagger/schemas/mission.schema.ts
export const missionSchemas = {
    Mission: {
        type: "object",
        properties: {
            // ... your schema
        },
    },
    CreateMissionDto: {
        // ...
    },
};
```

### 2. Import in index.ts:
```typescript
// src/config/swagger/schemas/index.ts
import { missionSchemas } from "./mission.schema";

export const schemas = {
    ...commonSchemas,
    ...userSchemas,
    ...missionSchemas, // Add this line
};
```

That's it! The schema is now available in Swagger UI.

## Benefits

✅ **Easy to maintain** - Each domain in its own file  
✅ **Scalable** - Add new entities without touching existing code  
✅ **Organized** - Clear separation by domain  
✅ **Team-friendly** - Multiple developers can work on different schemas without conflicts  
✅ **Reusable** - Import schemas wherever needed (tests, validation, etc.)

## Guidelines

1. **One file per domain** - User schemas in user.schema.ts
2. **Consistent naming** - `{entity}Schemas` export name
3. **Group related schemas** - Keep DTOs with their entities
4. **Use common.schema.ts** - For shared/reusable schemas
5. **Keep swagger.ts minimal** - Only config, import schemas from schemas/
