const config = {
  development: {
    apiUrl: 'http://localhost:8080'
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://your-backend-app.onrender.com'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const apiUrl = config[environment].apiUrl; 