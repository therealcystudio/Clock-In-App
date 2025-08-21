#!/bin/bash

echo "Stopping Employee Clock In/Clock Out System..."

# Kill processes running on ports 8080 and 3000
echo "Stopping backend (port 8080)..."
lsof -ti:8080 | xargs kill -9 2>/dev/null || echo "No backend process found"

echo "Stopping frontend (port 3000)..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No frontend process found"

echo "Applications stopped." 