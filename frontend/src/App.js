import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import AdminView from './AdminView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    accessCode: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Check if it's an admin login
      if (formData.accessCode === '888') {
        const adminResponse = await axios.post('/api/admin/login', formData);
        setIsAdmin(true);
        setIsLoggedIn(true);
        setMessage('Admin login successful!');
        return;
      }

      // Regular employee login
      const response = await axios.post('/api/time-entries/login', formData);
      setUser({
        firstName: response.data.firstName,
        lastName: response.data.lastName
      });
      setCurrentStatus(response.data.currentStatus);
      setIsLoggedIn(true);
      setMessage('Login successful!');
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/time-entries/clock-in', formData);
      setCurrentStatus(response.data);
      setMessage('Successfully clocked in!');
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.error || 'Clock in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/time-entries/clock-out', formData);
      setCurrentStatus(response.data);
      setMessage('Successfully clocked out!');
      loadHistory();
    } catch (err) {
      setError(err.response?.data?.error || 'Clock out failed');
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await axios.get(`/api/time-entries/history/${user.firstName}/${user.lastName}?accessCode=${formData.accessCode}`);
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    setCurrentStatus(null);
    setHistory([]);
    setFormData({
      firstName: '',
      lastName: '',
      accessCode: ''
    });
    setMessage('');
    setError('');
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="card">
          <h1>Employee Clock In/Clock Out System</h1>
          <p>Please enter your information to login:</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="accessCode">Access Code:</label>
              <input
                type="password"
                id="accessCode"
                name="accessCode"
                className="form-control"
                value={formData.accessCode}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
            <strong>Employee Access Code:</strong> 777<br/>
            <strong>Admin Access Code:</strong> 888
          </div>
        </div>
      </div>
    );
  }

  // Show admin view if user is admin
  if (isAdmin) {
    return <AdminView onLogout={handleLogout} />;
  }

  // Show regular employee view
  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Welcome, {user.firstName} {user.lastName}!</h1>
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
        
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="card">
          <h2>Current Status</h2>
          {currentStatus ? (
            <div>
              <p><strong>Status:</strong> 
                <span className={`status-badge ${currentStatus.isActive ? 'status-active' : 'status-inactive'}`}>
                  {currentStatus.isActive ? 'CLOCKED IN' : 'CLOCKED OUT'}
                </span>
              </p>
              <p><strong>Clock In Time:</strong> {formatDateTime(currentStatus.clockInTime)}</p>
              {currentStatus.clockOutTime && (
                <p><strong>Clock Out Time:</strong> {formatDateTime(currentStatus.clockOutTime)}</p>
              )}
              {currentStatus.totalHours && (
                <p><strong>Total Hours:</strong> {currentStatus.totalHours} hours</p>
              )}
            </div>
          ) : (
            <p>No active time entry</p>
          )}
          
          <div style={{ marginTop: '20px' }}>
            {!currentStatus || !currentStatus.isActive ? (
              <button onClick={handleClockIn} className="btn btn-success" disabled={loading}>
                {loading ? 'Processing...' : 'Clock In'}
              </button>
            ) : (
              <button onClick={handleClockOut} className="btn btn-danger" disabled={loading}>
                {loading ? 'Processing...' : 'Clock Out'}
              </button>
            )}
          </div>
        </div>
        
        <div className="card">
          <h2>Time Entry History</h2>
          {history.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.clockInTime).toLocaleDateString()}</td>
                    <td>{formatDateTime(entry.clockInTime)}</td>
                    <td>{formatDateTime(entry.clockOutTime)}</td>
                    <td>{entry.totalHours ? `${entry.totalHours} hours` : 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${entry.isActive ? 'status-active' : 'status-inactive'}`}>
                        {entry.isActive ? 'ACTIVE' : 'COMPLETED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No time entries found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 