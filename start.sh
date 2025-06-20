#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/docker"

# Step 1: Tear down old containers and volumes
docker-compose down -v

# Step 2: Start up the stack in detached mode
docker-compose up -d

# Step 3: Wait for the frontend to be available
URL="http://localhost:5173/login"
MAX_ATTEMPTS=30
SLEEP_SECONDS=1
ATTEMPT=0

echo "⏳ Waiting for $URL to respond..."

until curl -s --head "$URL" | grep -q "200 OK"; do
  ATTEMPT=$((ATTEMPT+1))
  if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
    echo "❌ Timeout: $URL did not respond after $((MAX_ATTEMPTS * SLEEP_SECONDS)) seconds."
    exit 1
  fi
  sleep $SLEEP_SECONDS
done

echo "✅ Service is up at $URL. Opening browser..."

# Step 4: Open in browser depending on OS
case "$(uname)" in
  Darwin) open "$URL" ;;   # macOS
  Linux) xdg-open "$URL" ;; # Most Linux distros
  *) echo "🌐 Please open $URL manually in your browser." ;;
esac
