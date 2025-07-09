#!/bin/bash

echo "🚀 Setting up PostgreSQL migration..."

# Navigate to nodejs-backend directory
cd nodejs-backend

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env: cp .env.example .env"
echo "2. Start the application: docker-compose up"
echo "3. Run database migrations: docker-compose exec backend npm run db:push"
echo "4. (Optional) Seed data: docker-compose exec backend npx ts-node popProductsDb.ts"
