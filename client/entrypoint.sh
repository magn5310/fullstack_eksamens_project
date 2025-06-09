#!/bin/bash

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
until mysqladmin ping -h mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" --silent; do
  echo "❌ MySQL is unavailable - sleeping"
  sleep 2
done

echo "✅ MySQL is up - running migrations"
# Run Prisma migrations

npx prisma db push
echo "✅ Migrations completed"

echo "🚀 Starting app..."
npm run start
