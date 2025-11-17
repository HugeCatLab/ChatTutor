#!/bin/sh
set -e

echo "🚀 Starting ChatTutor..."

# Function to wait for database
wait_for_db() {
  echo "⏳ Waiting for database to be ready..."
  
  # Extract database connection details from DATABASE_URL
  # Format: postgresql://user:password@host:port/database
  DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\(.*\):.*/\1/p')
  DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
  
  if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ]; then
    echo "⚠️  Could not parse DATABASE_URL, skipping database wait"
    return 0
  fi
  
  MAX_RETRIES=30
  RETRY_COUNT=0
  
  until nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
      echo "❌ Database connection timeout after $MAX_RETRIES attempts"
      exit 1
    fi
    echo "⏳ Waiting for database... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 1
  done
  
  echo "✅ Database is ready!"
}

# Function to initialize database
init_database() {
  echo "🔧 Initializing database..."
  
  # Check if we should skip initialization
  if [ "$SKIP_DB_INIT" = "true" ]; then
    echo "⏭️  Skipping database initialization (SKIP_DB_INIT=true)"
    return 0
  fi
  
  # Run database migrations/push
  if pnpm db:push 2>&1; then
    echo "✅ Database initialized successfully!"
  else
    echo "⚠️  Database initialization failed, but continuing..."
    echo "ℹ️  This might be normal if the database is already initialized"
  fi
}

# Main execution
echo "📦 ChatTutor Docker Container"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for database to be ready
wait_for_db

# Initialize database
init_database

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Starting application server..."
echo ""

# Execute the main command (start the application)
exec "$@"

