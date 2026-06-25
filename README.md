# Backend Starter

Express + TypeScript + Prisma + PostgreSQL

---

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.sample .env
```

Open `.env` and fill in your values:

```env
PORT=5000
APPLICATION_NAME=backend-starter
NODE_ENV=development

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret

CORS_DEV_ORIGIN=http://localhost:5173
CORS_PROD_ORIGIN=https://yourdomain.com
```

> `DATABASE_URL` format: `postgresql://postgres:password@localhost:5432/mydb`

### 3. Add your models to the schema

Edit `prisma/schema.prisma` and define your models, then run:

```bash
pnpm prisma migrate dev --name init
```

This creates the `prisma/migrations/` folder and applies the schema to your database.

### 4. Generate the Prisma client

```bash
pnpm prisma generate
```

This generates the typed client to `src/generated/prisma/`.

> Always run this after cloning the repo or changing the schema — the generated client is gitignored.

### 5. Seed the database (optional)

```bash
pnpm prisma db seed
```

### 6. Start the dev server

```bash
pnpm dev
```

---

## Prisma Quick Reference

```bash
pnpm prisma generate           # Regenerate client after schema changes
pnpm prisma migrate dev        # Create and apply a new migration
pnpm prisma migrate deploy     # Apply migrations in production
pnpm prisma db seed            # Run the seed file
pnpm prisma studio             # Open Prisma Studio (DB GUI)
```

---

## Project Structure

```
backend-starter/
├── app.ts                  # Entry point
├── prisma.config.ts        # Prisma DB connection config
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration history
│   └── seed.ts             # Seed script
└── src/
    ├── config/
    │   └── app.config.ts   # App config + Prisma client instance
    ├── controllers/
    ├── middlewares/
    ├── routes/
    ├── service/
    └── utils/
```
