# Employee Clock In/Clock Out System

A full-stack web application for managing employee time tracking with clock in/clock out functionality.

## Features

- **Employee Login**: Secure access with access codes
- **Clock In/Out**: Simple one-click time tracking
- **Time History**: View past time entries and total hours
- **Admin Dashboard**: Comprehensive overview of all employees
- **Weekly View**: Detailed weekly breakdown of employee hours
- **Real-time Status**: Current clock in/out status for each employee

## Tech Stack

### Backend
- **Spring Boot 3.2.0** - Java framework
- **Spring Data JPA** - Database ORM
- **H2 Database** - Development database
- **PostgreSQL** - Production database
- **Maven** - Build tool

### Frontend
- **React 18** - UI framework
- **Axios** - HTTP client
- **CSS3** - Styling

## Local Development

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- Maven

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

3. The backend will be available at `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The frontend will be available at `http://localhost:3000`

## Deployment to Render

This application is configured for deployment on Render.com. Follow these steps to deploy:

### 1. Prepare Your Repository
- Ensure all code is committed to a Git repository (GitHub, GitLab, etc.)
- Make sure the repository is public or connected to your Render account

### 2. Deploy Backend Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `clockin-backend`
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/employee-clockin-0.0.1-SNAPSHOT.jar`

### 3. Create PostgreSQL Database
1. In Render Dashboard, click "New +" and select "PostgreSQL"
2. Configure the database:
   - **Name**: `clockin-db`
   - **Database**: `clockindb`
   - **User**: `clockin_user`
   - **Region**: Same as your backend service

### 4. Configure Environment Variables
In your backend service settings, add these environment variables:
- `SPRING_PROFILES_ACTIVE`: `prod`
- `DATABASE_URL`: (from your PostgreSQL service)
- `DB_USERNAME`: (from your PostgreSQL service)
- `DB_PASSWORD`: (from your PostgreSQL service)
- `FRONTEND_URL`: `https://your-frontend-app.onrender.com`

### 5. Deploy Frontend Service
1. In Render Dashboard, click "New +" and select "Static Site"
2. Connect your Git repository
3. Configure the service:
   - **Name**: `clockin-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add environment variable:
   - `REACT_APP_API_URL`: `https://your-backend-app.onrender.com`

### 6. Update Configuration
After deployment, update the URLs in your configuration files:
- Update `frontend/src/config.js` with your actual backend URL
- Update `render.yaml` with your actual service URLs

## Access Codes

- **Employee Access Code**: `777`
- **Admin Access Code**: `888`

## API Endpoints

### Employee Endpoints
- `POST /api/time-entries/login` - Employee login
- `POST /api/time-entries/clock-in` - Clock in
- `POST /api/time-entries/clock-out` - Clock out
- `GET /api/time-entries/history/{firstName}/{lastName}` - Get employee history

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/all-employees` - Get all employees
- `GET /api/admin/summary` - Get system summary
- `GET /api/admin/employee/{firstName}/{lastName}` - Get employee details
- `GET /api/admin/employee/{firstName}/{lastName}/weekly` - Get weekly view

## File Structure

```
clockin/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/java/
│   │   │   └── com/clockin/
│   │   │       ├── controller/    # REST controllers
│   │   │       ├── model/         # Entity models
│   │   │       ├── repository/    # Data repositories
│   │   │       ├── service/       # Business logic
│   │   │       └── dto/           # Data transfer objects
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-prod.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   ├── AdminView.js    # Admin dashboard
│   │   ├── WeeklyView.js   # Weekly time view
│   │   ├── config.js       # Configuration
│   │   └── App.css         # Styles
│   └── package.json
├── render.yaml             # Render deployment configuration
└── README.md
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Ensure all dependencies are properly specified in `pom.xml` and `package.json`

2. **Database Connection**: Verify environment variables are correctly set in Render dashboard

3. **CORS Issues**: Check that `FRONTEND_URL` environment variable is set correctly

4. **Port Issues**: Render automatically assigns ports, ensure your application uses `PORT` environment variable

### Local Development Issues

1. **Maven Build**: Run `./mvnw clean install` to ensure all dependencies are downloaded

2. **Node Modules**: Delete `node_modules` and run `npm install` if you encounter dependency issues

3. **Database**: The application uses H2 in-memory database for development, no setup required

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE). 