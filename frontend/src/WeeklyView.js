import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeeklyView({ employee, onBack, accessCode }) {
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWeeklyData();
  }, [employee]);

  const loadWeeklyData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        `/api/admin/employee/${employee.firstName}/${employee.lastName}/weekly?accessCode=${accessCode}`
      );
      setWeeklyData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load weekly data');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString();
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getWeekdayColor = (weekday) => {
    const colors = {
      'Monday': '#e3f2fd',
      'Tuesday': '#f3e5f5',
      'Wednesday': '#e8f5e8',
      'Thursday': '#fff3e0',
      'Friday': '#fce4ec',
      'Saturday': '#f1f8e9',
      'Sunday': '#fafafa'
    };
    return colors[weekday] || '#ffffff';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h2>Loading Weekly Data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="alert alert-danger">{error}</div>
          <button onClick={onBack} className="btn btn-primary">Back to Employee List</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Weekly View: {weeklyData?.employeeName}</h1>
          <button onClick={onBack} className="btn btn-secondary">Back to Employee List</button>
        </div>

        {/* Employee Summary */}
        <div className="card">
          <h2>Employee Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={{ textAlign: 'center', padding: '15px', background: '#e9ecef', borderRadius: '5px' }}>
              <h4>{weeklyData?.totalHours || 0} hrs</h4>
              <p>Total Hours</p>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', background: '#e9ecef', borderRadius: '5px' }}>
              <h4>{weeklyData?.totalEntries || 0}</h4>
              <p>Total Entries</p>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', background: '#e9ecef', borderRadius: '5px' }}>
              <h4>{weeklyData?.weeklyData?.length || 0}</h4>
              <p>Weeks</p>
            </div>
          </div>
        </div>

        {/* Weekly Data */}
        {weeklyData?.weeklyData?.length === 0 ? (
          <div className="card">
            <h2>Weekly Breakdown</h2>
            <p>No time entries found</p>
          </div>
        ) : (
          weeklyData?.weeklyData?.map((week, weekIndex) => (
            <div key={week.weekKey} className="card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '15px',
                padding: '10px',
                background: '#f8f9fa',
                borderRadius: '5px'
              }}>
                <h3>{week.weekLabel}</h3>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                    {week.totalHours} hours
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {week.entryCount} entries
                  </div>
                </div>
              </div>

              {/* Weekdays */}
              <div style={{ display: 'grid', gap: '15px' }}>
                {week.weekdays.map((day, dayIndex) => (
                  <div key={day.weekday} style={{ 
                    border: '1px solid #dee2e6', 
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      padding: '10px 15px', 
                      background: getWeekdayColor(day.weekday),
                      borderBottom: '1px solid #dee2e6',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h4 style={{ margin: 0, color: '#333' }}>{day.weekday}</h4>
                      <span style={{ 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        color: '#007bff' 
                      }}>
                        {day.totalHours} hours
                      </span>
                    </div>

                    {/* Day Entries */}
                    {day.entries.length === 0 ? (
                      <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                        No entries for this day
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table" style={{ margin: 0 }}>
                          <thead>
                            <tr>
                              <th>Clock In</th>
                              <th>Clock Out</th>
                              <th>Duration</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.entries.map((entry) => (
                              <tr key={entry.id}>
                                <td>{formatTime(entry.clockInTime)}</td>
                                <td>{entry.clockOutTime ? formatTime(entry.clockOutTime) : 'Active'}</td>
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
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WeeklyView; 