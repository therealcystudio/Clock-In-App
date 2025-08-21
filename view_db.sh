#!/bin/bash

echo "=== Employee Clock In/Clock Out Database Viewer ==="
echo ""

# Check if backend is running
if ! curl -s http://localhost:8080/api/time-entries/login > /dev/null 2>&1; then
    echo "❌ Backend is not running. Please start it first with:"
    echo "   cd backend && mvn spring-boot:run"
    exit 1
fi

echo "✅ Backend is running!"
echo ""

echo "=== H2 Database Console ==="
echo "🌐 Open in browser: http://localhost:8080/h2-console"
echo "📋 Connection details:"
echo "   JDBC URL: jdbc:h2:mem:clockindb"
echo "   Username: sa"
echo "   Password: password"
echo ""

echo "=== API Endpoints ==="
echo "📊 To view employee history:"
echo "   curl 'http://localhost:8080/api/time-entries/history/John/Doe?accessCode=777'"
echo ""
echo "📈 To view current status:"
echo "   curl 'http://localhost:8080/api/time-entries/status/John/Doe?accessCode=777'"
echo ""
echo "🔧 Admin endpoints (access code: 888):"
echo "   curl 'http://localhost:8080/api/admin/all-employees?accessCode=888'"
echo "   curl 'http://localhost:8080/api/admin/summary?accessCode=888'"
echo "   curl 'http://localhost:8080/api/admin/employee/John/Doe?accessCode=888'"
echo "   curl 'http://localhost:8080/api/admin/employee/John/Doe/weekly?accessCode=888'"
echo ""

echo "=== Quick Test ==="
echo "Let's test the API with a sample employee..."
echo ""

# Test with a sample employee
FIRST_NAME="Test"
LAST_NAME="User"
ACCESS_CODE="777"

echo "🔍 Testing with: $FIRST_NAME $LAST_NAME"
echo ""

# Get current status
echo "📊 Current Status:"
curl -s "http://localhost:8080/api/time-entries/status/$FIRST_NAME/$LAST_NAME?accessCode=$ACCESS_CODE" | jq '.' 2>/dev/null || curl -s "http://localhost:8080/api/time-entries/status/$FIRST_NAME/$LAST_NAME?accessCode=$ACCESS_CODE"
echo ""

# Get history
echo "📈 Employee History:"
curl -s "http://localhost:8080/api/time-entries/history/$FIRST_NAME/$LAST_NAME?accessCode=$ACCESS_CODE" | jq '.' 2>/dev/null || curl -s "http://localhost:8080/api/time-entries/history/$FIRST_NAME/$LAST_NAME?accessCode=$ACCESS_CODE"
echo ""

echo "=== Instructions ==="
echo "1. Use the H2 Console for direct database access"
echo "2. Use the API endpoints for programmatic access"
echo "3. The frontend will show data when you log in"
echo "4. Admin users can view all employee data with access code 888"
echo ""
echo "💡 Tip: Data is stored in memory, so it will be reset when you restart the backend" 