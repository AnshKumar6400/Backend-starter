# Prisma Setup

---

### 1. Install Prisma

```bash
pnpm add -D prisma
pnpm add @prisma/client @prisma/adapter-pg pg
```

### 2. Initialise Prisma

```bash
pnpm prisma init
```

This creates `prisma/schema.prisma` and `prisma.config.ts`.

### 3. Configure the connection

In `prisma.config.ts`:

```ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

In `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
```

### 4. Configure the schema

In `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// add your models below
```

### 5. Create and apply migration

```bash
pnpm prisma migrate dev --name init
```

### 6. Generate the client

```bash
pnpm prisma generate
```

### 7. Use in your app

```ts
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});
```

### 8. Gitignore the generated client

Add to `.gitignore`:

```
src/generated/
```

> Always run `pnpm prisma generate` after cloning — the client is not committed.

---

## Quick Reference

```bash
pnpm prisma generate          # Regenerate client after schema changes
pnpm prisma migrate dev       # Create and apply a migration (dev)
pnpm prisma migrate deploy    # Apply migrations (production)
pnpm prisma db seed           # Run seed file
pnpm prisma studio            # Open DB GUI
```
