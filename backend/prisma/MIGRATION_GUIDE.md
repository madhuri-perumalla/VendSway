# Prisma Migration Guide

## Overview

This guide provides step-by-step instructions for managing database migrations using Prisma ORM for the VendSway backend.

## Prerequisites

- PostgreSQL 15+ installed and running
- Node.js 18+ installed
- Environment variables configured in `.env`
- Database created in PostgreSQL

## Initial Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example environment file:
```bash
cp .env.example .env
```

Update the `DATABASE_URL` in `.env`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/fashion_tapestry?schema=public"
```

### 3. Generate Prisma Client

```bash
npm run prisma:generate
```

This generates the Prisma Client based on the schema.

### 4. Create Database

Create the database in PostgreSQL:
```bash
createdb fashion_tapestry
```

Or using psql:
```sql
CREATE DATABASE fashion_tapestry;
```

## Migration Commands

### Create Initial Migration

```bash
npm run prisma:migrate dev --name init
```

This command:
- Creates a new migration file in `prisma/migrations/`
- Applies the migration to the database
- Updates the Prisma Client

### Apply Migrations

```bash
npm run prisma:migrate deploy
```

This applies all pending migrations to the database (used in production).

### Reset Database

**⚠️ WARNING: This will delete all data in the database**

```bash
npm run prisma migrate reset
```

This command:
- Drops the database
- Recreates the database
- Applies all migrations
- Seeds the database (if seed file exists)

### View Migration Status

```bash
npx prisma migrate status
```

Shows the status of all migrations.

### Rollback Migration

Prisma doesn't support automatic rollbacks. To rollback:

1. Manually revert the migration SQL in `prisma/migrations/`
2. Or create a new migration that reverses the changes

## Seed Data

### Run Seed Script

```bash
npm run prisma:seed
```

This will populate the database with initial data defined in `prisma/seed.ts`.

## Prisma Studio

### Open Prisma Studio

```bash
npm run prisma:studio
```

This opens a visual database editor in your browser at `http://localhost:5555`.

## Development Workflow

### Making Schema Changes

1. **Modify `prisma/schema.prisma`**
   - Add/modify models, fields, relations, indexes

2. **Create Migration**
   ```bash
   npm run prisma:migrate dev --name describe_change
   ```

3. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

4. **Test Changes**
   - Use Prisma Studio to verify
   - Run seed script if needed

### Common Schema Changes

#### Add a Field

```prisma
model Product {
  // existing fields
  newField String?
}
```

```bash
npm run prisma:migrate dev --name add_new_field
```

#### Add an Index

```prisma
model Product {
  // existing fields
  
  @@index([newField])
}
```

```bash
npm run prisma:migrate dev --name add_index
```

#### Add a Relation

```prisma
model Product {
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
}

model Category {
  id       String    @id @default(uuid())
  products Product[]
}
```

```bash
npm run prisma:migrate dev --name add_category_relation
```

#### Rename a Field

```prisma
model Product {
  oldName String @map("old_column_name")
  
  @@map("products")
}
```

Then create a migration to rename the column manually.

## Production Deployment

### Deploy Migrations

```bash
npm run prisma:migrate deploy
```

This applies migrations without creating a new migration file.

### Generate Client in Production

```bash
npm run prisma:generate
```

## Troubleshooting

### Migration Conflicts

If you encounter migration conflicts:

1. Check the migration files in `prisma/migrations/`
2. Ensure the database schema matches the expected state
3. Use `prisma migrate reset` as a last resort

### Database Connection Issues

If you can't connect to the database:

1. Verify PostgreSQL is running
2. Check the `DATABASE_URL` in `.env`
3. Ensure the database exists
4. Check firewall/network settings

### Prisma Client Generation Issues

If the Prisma Client fails to generate:

1. Delete the `node_modules/.prisma` folder
2. Run `npm run prisma:generate` again
3. Ensure all dependencies are installed

## Best Practices

1. **Always create migrations** for schema changes
2. **Describe migrations clearly** with meaningful names
3. **Test migrations** in development before production
4. **Backup database** before running migrations in production
5. **Use version control** for migration files
6. **Review generated SQL** before applying migrations
7. **Keep seed data** separate from migrations

## Migration Naming Convention

Use descriptive names for migrations:
- `init` - Initial database setup
- `add_user_role_enum` - Add user role enum
- `add_product_indexes` - Add product indexes
- `create_seller_application_table` - Create seller application table

## Schema Validation

### Validate Schema

```bash
npx prisma validate
```

This checks for syntax errors and validates the schema.

### Format Schema

```bash
npx prisma format
```

This formats the schema file according to Prisma conventions.

## Additional Resources

- [Prisma Migrations Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
