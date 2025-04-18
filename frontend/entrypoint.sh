#!/bin/sh
set -e
echo "VITE_SERVER_URL=${VITE_SERVER_URL}"
echo "Searching for placeholder..."
find /usr/share/nginx/html -type f -name "*.js" -exec grep -l "__VITE_SERVER_URL__" {} \; || echo "No files contain placeholder"
export VITE_SERVER_URL="${VITE_SERVER_URL:-https://default-api.example.com}"
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|__VITE_SERVER_URL__|${VITE_SERVER_URL}|g" {} \;
echo "Replacement complete"
exec nginx -g 'daemon off;'