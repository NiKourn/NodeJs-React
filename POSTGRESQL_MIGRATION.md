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

```

```
