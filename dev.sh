#!/usr/bin/env bash
set -e

CONFIG="admin/config.yml"

# Enable local backend
if grep -q "^# *local_backend: true" "$CONFIG"; then
  sed -i 's/^# *local_backend: true/local_backend: true/' "$CONFIG"
  echo "Enabled local_backend in $CONFIG"
elif grep -q "^local_backend: true" "$CONFIG"; then
  echo "local_backend already enabled"
else
  sed -i '1s/^/local_backend: true\n/' "$CONFIG"
  echo "Added local_backend to $CONFIG"
fi

# Re-comment local_backend on exit
cleanup() {
  echo ""
  echo "Shutting down..."
  sed -i 's/^local_backend: true/# local_backend: true/' "$CONFIG"
  echo "Disabled local_backend in $CONFIG"
  kill 0 2>/dev/null
}
trap cleanup EXIT

# Start decap-server and live-server in parallel
npx decap-server &
npx live-server &

echo ""
echo "CMS available at http://localhost:8080/admin/"
echo "Press Ctrl+C to stop all servers and disable local_backend."

wait
