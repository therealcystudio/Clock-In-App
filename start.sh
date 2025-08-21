#!/bin/bash

echo "Starting Employee Clock In/Clock Out System..."
echo "=============================================="

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed. Please install Java 17 or later."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm."
    exit 1
fi

echo "Prerequisites check passed!"

# Start backend
echo "Starting Spring Boot backend..."
cd backend

# Check if port 8080 is available
if check_port 8080; then
    echo "Warning: Port 8080 is already in use. Backend may not start properly."
fi

# Start backend in background
./mvnw spring-boot:run > ../backend.log 2>&1 &
BACKEND_PID=$!

echo "Backend started with PID: $BACKEND_PID"

# Wait a bit for backend to start
echo "Waiting for backend to start..."
sleep 10

# Check if backend is running
if check_port 8080; then
    echo "Backend is running on http://localhost:8080"
else
    echo "Warning: Backend may not have started properly. Check backend.log for details."
fi

# Start frontend
echo "Starting React frontend..."
cd ../frontend

# Check if port 3000 is available
if check_port 3000; then
    echo "Warning: Port 3000 is already in use. Frontend may not start properly."
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!

echo "Frontend started with PID: $FRONTEND_PID"

# Wait a bit for frontend to start
echo "Waiting for frontend to start..."
sleep 15

# Check if frontend is running
if check_port 3000; then
    echo "Frontend is running on http://localhost:3000"
else
    echo "Warning: Frontend may not have started properly. Check frontend.log for details."
fi

echo ""
echo "=============================================="
echo "Employee Clock In/Clock Out System is starting!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8080"
echo "H2 Console: http://localhost:8080/h2-console"
echo ""
echo "Demo Access Code: 777"
echo ""
echo "To stop the applications, press Ctrl+C"
echo "=============================================="

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping applications..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Applications stopped."
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
wait 