# Database Migrations with Prisma & PostgreSQL

## 🤔 What Are Database Migrations?

Database migrations are **version-controlled scripts** that modify your database schema over time. They're like "Git for your database structure" - allowing you to:

- Track and apply schema changes consistently across environments
- Collaborate with team members without breaking databases
- Rollback changes safely if needed
- Maintain a history of all database modifications

## 🚀 Why Migrations Matter

**Without migrations:** Team members manually recreate database changes, leading to inconsistencies and crashes.

**With migrations:** Everyone runs the same migration files and gets identical database structures.

## 🔧 Docker Platform Compatibility

This project has been configured for cross-platform compatibility. The `docker-compose.yml` includes platform specifications to prevent ARM64/AMD64 warnings:

```yaml
mailhog:
  image: mailhog/mailhog
  platform: linux/amd64  # Ensures compatibility across platforms
```

## 🛠️ Essential Commands

### Development Workflow

```bash
# 1. Modify prisma/schema.prisma
# 2. Create and apply migration
docker exec -it nodejs-srv npx prisma migrate dev --name your_migration_name

# Quick prototyping (no migration files)
docker exec -it nodejs-srv npx prisma db push

# Generate Prisma client after schema changes
docker exec -it nodejs-srv npx prisma generate
```

### Production Deployment

```bash
# Apply pending migrations in production
docker exec -it nodejs-srv npx prisma migrate deploy

# Check migration status
docker exec -it nodejs-srv npx prisma migrate status
```

### Database Management

```bash
# Reset database and reapply all migrations
docker exec -it nodejs-srv npx prisma migrate reset

# Open database GUI
docker exec -it nodejs-srv npx prisma studio
```

## 📝 Adding a New Table (Example)

Let's add a `posts` table:

### 1. Update Schema

Add to `prisma/schema.prisma`:

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}

// Add to existing User model:
model User {
  // ...existing fields...
  posts    Post[]  // Add this relationship
  // ...rest of fields...
}
```

### 2. Create Migration

```bash
docker exec -it nodejs-srv npx prisma migrate dev --name add_posts_table
```

### 3. Use in Code

```typescript
// Create a post
const post = await prisma.post.create({
	data: {
		title: 'My First Post',
		content: 'Hello World!',
		authorId: 1,
	},
})

// Get posts with authors
const posts = await prisma.post.findMany({
	include: { author: true },
})
```

## ⚡ Quick Reference

### When to Use What

| Command          | Use Case                                   |
| ---------------- | ------------------------------------------ |
| `migrate dev`    | Team development, production-ready changes |
| `db push`        | Solo work, rapid prototyping, experiments  |
| `migrate deploy` | Production deployments                     |
| `migrate reset`  | Start fresh, fix broken migrations         |

### File Structure

```
prisma/
├── schema.prisma              # Your database schema
└── migrations/
    ├── migration_lock.toml    # Database provider lock
    └── 20250709102358_init/   # Migration folder
        └── migration.sql      # SQL commands
```

### The `_prisma_migrations` Table

Automatically tracks which migrations have been applied to your database.

## 🔄 Development vs Production Workflow

### Why Different Commands?

The key difference is **safety** and **collaboration**:

#### Development: `migrate dev`

```bash
npx prisma migrate dev --name add_feature
```

- ✅ **Creates** migration files from schema changes
- ✅ **Warns** about potential data loss
- ✅ **Interactive** - can prompt for decisions
- ✅ **Safe to experiment** and reset

#### Production: `migrate deploy`

```bash
npx prisma migrate deploy
```

- ✅ **Only applies** existing, tested migration files
- ✅ **No prompts** - fully automated
- ✅ **Predictable** - no unexpected changes
- ✅ **Fail-fast** if migrations are missing

### Complete Team Workflow

```bash
# 1. Developer makes schema changes
# (edit prisma/schema.prisma)

# 2. Create migration in development
npx prisma migrate dev --name add_posts_table
# → Creates migration files
# → Applies to dev database

# 3. Commit migration files to git
git add prisma/migrations/
git commit -m "Add posts table"

# 4. Team member pulls changes
git pull
npx prisma migrate dev
# → Applies the new migration to their dev DB

# 5. Deploy to production
npx prisma migrate deploy
# → Only applies the tested migration files
```

### What Could Go Wrong?

**❌ Using `migrate dev` in production:**

- Could generate unexpected migrations
- Might require user input (breaks automation)
- Bypasses your testing process

**❌ Using `migrate deploy` in development:**

- Won't create migrations for schema changes
- No helpful warnings or prompts
- Harder to iterate quickly

## 🔄 Complete Project Workflow

Here's the full workflow from fresh setup to production, including data seeding:

### 1. Fresh Project Setup

```bash
# Clone project and start containers
git clone <your-repo>
cd app
docker-compose up -d

# Wait for containers to start, then initialize database
docker exec -it nodejs-srv npx prisma migrate dev --name init
docker exec -it nodejs-srv npx prisma generate
```

### 2. Seed Database with Sample Data

```bash
# Populate products table with 20 sample products
docker exec -it nodejs-srv npm run seed

# Verify data was imported
curl -X POST http://localhost:5500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "username": "testuser", "password": "password123"}'

# Login to get token
curl -X POST http://localhost:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername": "test@example.com", "password": "password123"}'

# Check products (use token from login response)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5500/api/products
```

### 3. Adding New Features (Schema Changes)

```bash
# Example: Add a posts table
# 1. Edit prisma/schema.prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("posts")
}

# 2. Create and apply migration
docker exec -it nodejs-srv npx prisma migrate dev --name add_posts_table

# 3. Update your models/controllers to use the new table
# 4. Test the changes locally
```

### 4. Team Collaboration Workflow

```bash
# Developer A adds a new feature
git checkout -b feature/add-comments
# (make schema changes)
docker exec -it nodejs-srv npx prisma migrate dev --name add_comments
git add prisma/migrations/
git commit -m "Add comments functionality"
git push origin feature/add-comments

# Developer B pulls the changes
git checkout main
git pull origin main
docker exec -it nodejs-srv npx prisma migrate dev
# → Applies new migrations automatically
```

### 5. Production Deployment Workflow

```bash
# 1. Prepare for deployment
# Ensure all migrations are committed and tested

# 2. Deploy application code
git tag v1.2.0
git push origin v1.2.0

# 3. Apply migrations in production (automated via CI/CD)
docker exec -it production-backend npx prisma migrate deploy

# 4. Verify deployment
docker exec -it production-backend npx prisma migrate status

# 5. Optional: Seed production with initial data (one-time)
docker exec -it production-backend npm run seed
```

### 6. Ongoing Development Cycle

```bash
# Daily development workflow
# 1. Pull latest changes
git pull origin main

# 2. Apply any new migrations
docker exec -it nodejs-srv npx prisma migrate dev

# 3. Make your changes
# (edit schema, create new models, etc.)

# 4. Create migration for your changes
docker exec -it nodejs-srv npx prisma migrate dev --name your_feature_name

# 5. Test your changes
docker exec -it nodejs-srv npm test  # if you have tests
# Manual testing via API calls

# 6. Commit and push
git add .
git commit -m "Add new feature"
git push origin your-branch
```

### 7. Database Maintenance

```bash
# View current database state
docker exec -it nodejs-srv npx prisma studio
# → Opens GUI at http://localhost:5555

# Check migration status
docker exec -it nodejs-srv npx prisma migrate status

# Reset database if needed (development only!)
docker exec -it nodejs-srv npx prisma migrate reset
docker exec -it nodejs-srv npm run seed  # Re-populate data

# Backup production database
docker exec -it postgresql-srv pg_dump -U postgres app_db > backup.sql
```

### 8. Common Development Tasks

```bash
# Add a new field to existing table
# 1. Edit schema.prisma
# 2. Create migration
docker exec -it nodejs-srv npx prisma migrate dev --name add_user_phone

# Remove a field (careful!)
# 1. Edit schema.prisma
# 2. Create migration (will prompt about data loss)
docker exec -it nodejs-srv npx prisma migrate dev --name remove_deprecated_field

# Rename a field (preserve data)
# Use @@map attribute in schema:
oldFieldName String @map("new_field_name")

# Create indexes for performance
# Add to schema.prisma:
@@index([email])
@@index([createdAt])
```

### 9. Troubleshooting Common Issues

```bash
# Migration failed? Check what's wrong
docker exec -it nodejs-srv npx prisma migrate status

# Database out of sync?
docker exec -it nodejs-srv npx prisma migrate resolve --applied migration_name

# Docker platform warnings (ARM64/AMD64)?
# Already fixed in docker-compose.yml with platform: linux/amd64 for mailhog

# Start completely fresh (nuclear option)
docker-compose down -v  # Removes all data!
```

### 10. Platform Compatibility

The project has been configured for cross-platform compatibility:

- **Mailhog**: Specified `platform: linux/amd64` to prevent ARM64/AMD64 warnings
- **Node.js**: Updated to version 22 with proper SSL libraries for Prisma
- **PostgreSQL**: Using stable postgres:15 image compatible with all platforms

If you encounter platform-specific issues, check the Docker logs:
```bash
docker-compose logs [service-name]
```

This workflow covers everything from initial setup to ongoing development and production deployment!
