#!/bin/bash

echo "🚀 Employee Clock-In System Deployment Script"
echo "=============================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if we have a remote repository
if ! git remote get-url origin &> /dev/null; then
    echo "⚠️  No remote repository found. Please add a remote:"
    echo "   git remote add origin <your-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

echo "✅ Git repository is ready"

# Check if all files are committed
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for deployment'"
    exit 1
fi

echo "✅ All changes are committed"

# Push to remote
echo "📤 Pushing to remote repository..."
git push origin main

echo ""
echo "🎉 Code pushed successfully!"
echo ""
echo "📋 Next steps for Render deployment:"
echo ""
echo "1. Go to https://dashboard.render.com"
echo "2. Click 'New +' and select 'Web Service'"
echo "3. Connect your Git repository"
echo "4. Configure the backend service:"
echo "   - Name: clockin-backend"
echo "   - Environment: Docker"
echo "   - Root Directory: backend"
echo "   - Build Command: ./mvnw clean package -DskipTests"
echo "   - Start Command: java -jar target/employee-clockin-0.0.1-SNAPSHOT.jar"
echo ""
echo "5. Create a PostgreSQL database:"
echo "   - Name: clockin-db"
echo "   - Database: clockindb"
echo "   - User: clockin_user"
echo ""
echo "6. Set environment variables in backend service:"
echo "   - SPRING_PROFILES_ACTIVE: prod"
echo "   - DATABASE_URL: (from PostgreSQL service)"
echo "   - DB_USERNAME: (from PostgreSQL service)"
echo "   - DB_PASSWORD: (from PostgreSQL service)"
echo "   - FRONTEND_URL: https://your-frontend-app.onrender.com"
echo ""
echo "7. Deploy frontend as Static Site:"
echo "   - Name: clockin-frontend"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm install && npm run build"
echo "   - Publish Directory: build"
echo "   - Environment Variable: REACT_APP_API_URL=https://your-backend-app.onrender.com"
echo ""
echo "📖 For detailed instructions, see README.md" 