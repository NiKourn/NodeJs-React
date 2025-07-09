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

## 🚨 Common Scenarios

### Adding Required Field to Existing Table

```prisma
# ❌ This will fail if users exist
phoneNumber String

# ✅ Make it optional first
phoneNumber String?
```

### Renaming a Field

```prisma
# Use @@map to preserve existing data
displayName String @map("username")
```

### Migration Naming

```bash
# ✅ Good names
add_posts_table
remove_deprecated_fields
add_user_indexes

# ❌ Bad names
fix_stuff
update
changes
```

## 🎯 Best Practices

1. **Always backup production** before migrations
2. **Test migrations** on production-like data first
3. **Use descriptive names** for migrations
4. **Review generated SQL** before applying
5. **One logical change** per migration

## 🔧 Troubleshooting

### Migration Failed?

```bash
# Check status
npx prisma migrate status

# Fix and retry
npx prisma migrate dev

# Nuclear option: reset everything
npx prisma migrate reset
```

### Database Out of Sync?

```bash
# Mark migration as applied (without running)
npx prisma migrate resolve --applied migration_name
```

## 📊 Current Setup

Your app now uses:

- **PostgreSQL** database on `localhost:5432`
- **Prisma** for type-safe database access
- **Migration tracking** via `_prisma_migrations` table

### Tables

- `users` - Authentication and user data
- `products` - Product catalog (20 items)
- `_prisma_migrations` - Migration history

### Database Access

- **Host:** `localhost:5432`
- **Database:** `app_db`
- **User/Pass:** `postgres/postgres`
- **GUI:** Run `npx prisma studio` → `http://localhost:5555`

---

**🎉 You're all set!** Your database changes are now version-controlled and team-ready.
