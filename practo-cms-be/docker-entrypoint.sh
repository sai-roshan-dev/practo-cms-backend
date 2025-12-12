#!/bin/sh
set -e

# Run database migrations
echo "Running database migrations..."
echo "Checking DATABASE_URL..."
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set!"
  exit 1
fi

# Try to run migrations, but don't fail if database is not ready
echo "Attempting to run migrations..."
npx prisma migrate deploy || {
  echo "WARNING: Migration failed, but continuing to start application..."
  echo "You may need to run migrations manually later."
}

# Start the application
echo "Starting application..."
exec npm start

