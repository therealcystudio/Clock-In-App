# Employee Clock In/Clock Out System

A simple employee time tracking system with React.js frontend and Spring Boot backend.

## Features
- Employee login with first name, last name, and access code (777)
- Clock in/clock out functionality
- Time tracking history
- Simple demo authentication (no account creation needed)

## Tech Stack
- **Frontend**: React.js
- **Backend**: Spring Boot
- **ORM**: Hibernate
- **Database**: H2 (in-memory for demo)

## Project Structure
```
clockin/
├── frontend/          # React.js application
├── backend/           # Spring Boot application
└── README.md
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory
2. Run `./mvnw spring-boot:run` (or `mvn spring-boot:run` if you have Maven installed)
3. The backend will start on http://localhost:8080

### Frontend Setup
1. Navigate to the frontend directory
2. Run `npm install`
3. Run `npm start`
4. The frontend will start on http://localhost:3000

## Usage
1. Open http://localhost:3000 in your browser
2. Enter your first name, last name, and access code (777)
3. Click "Clock In" or "Clock Out" as needed
4. View your time tracking history 