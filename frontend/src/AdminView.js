import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeeklyView from './WeeklyView';

function AdminView({ onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showWeeklyView, setShowWeeklyView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accessCode] = useState('888');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      // Load all employees data
      const employeesResponse = await axios.get(`/api/admin/all-employees?accessCode=${accessCode}`);
      setEmployees(employeesResponse.data);

      // Load summary
      const summaryResponse = await axios.get(`/api/admin/summary?accessCode=${accessCode}`);
      setSummary(summaryResponse.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeDetails = async (firstName, lastName) => {
    try {
      const response = await axios.get(`/api/admin/employee/${firstName}/${lastName}?accessCode=${accessCode}`);
      setSelectedEmployee(response.data);
      setShowWeeklyView(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load employee details');
    }
  };

  const showWeeklyViewForEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowWeeklyView(true);
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleString();
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    return new Date(dateTimeString).toLocaleDateString();
  };

    if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h2>Loading Admin Dashboard...</h2>
        </div>
      </div>
    );
  }

  // Show weekly view if selected
  if (showWeeklyView && selectedEmployee) {
    return (
      <WeeklyView 
        employee={selectedEmployee}
        onBack={() => setShowWeeklyView(false)}
        accessCode={accessCode}
      />
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Admin Dashboard</h1>
          <button onClick={onLogout} className="btn btn-danger">Logout</button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Summary Cards */}
        {summary && (
          <div className="card">
            <h2>System Summary</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                <h3>{summary.totalEmployees}</h3>
                <p>Total Employees</p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                <h3>{summary.currentlyActive}</h3>
                <p>Currently Active</p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                <h3>{summary.totalHours} hrs</h3>
                <p>Total Hours</p>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
                <h3>{summary.totalEntries}</h3>
                <p>Total Entries</p>
              </div>
            </div>
          </div>
        )}

        {/* Employees List */}
        <div className="card">
          <h2>All Employees</h2>
          {employees.length === 0 ? (
            <p>No employees found</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Total Hours</th>
                    <th>Total Entries</th>
                    <th>Currently Active</th>
                    <th>Last Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{employee.employeeName}</strong>
                      </td>
                      <td>{employee.totalHours} hours</td>
                      <td>{employee.totalEntries}</td>
                      <td>
                        <span className={`status-badge ${employee.isCurrentlyActive ? 'status-active' : 'status-inactive'}`}>
                          {employee.isCurrentlyActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td>
                        {employee.latestEntry ? formatDateTime(employee.latestEntry.clockInTime) : 'N/A'}
                      </td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => loadEmployeeDetails(employee.firstName, employee.lastName)}
                          style={{ marginRight: '5px' }}
                        >
                          View Details
                        </button>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => showWeeklyViewForEmployee(employee)}
                        >
                          Weekly View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Employee Details Modal */}
        {selectedEmployee && !showWeeklyView && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Employee Details: {selectedEmployee.firstName} {selectedEmployee.lastName}</h2>
              <div>
                <button 
                  onClick={() => showWeeklyViewForEmployee(selectedEmployee)} 
                  className="btn btn-success"
                  style={{ marginRight: '10px' }}
                >
                  Weekly View
                </button>
                <button onClick={() => setSelectedEmployee(null)} className="btn btn-secondary">Close</button>
              </div>
            </div>

            {/* Employee Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', padding: '15px', background: '#e9ecef', borderRadius: '5px' }}>
                <h4>{selectedEmployee.totalHours} hrs</h4>
                <p>Total Hours</p>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', background: '#e9ecef', borderRadius: '5px' }}>
                <h4>{selectedEmployee.totalEntries}</h4>
                <p>Total Entries</p>
              </div>
              <div style={{ textAlign: 'center', padding: '15px', background: '#e9ecef', borderRadius: '5px' }}>
                <h4>{selectedEmployee.activeEntries}</h4>
                <p>Active Entries</p>
              </div>
            </div>

            {/* Employee Time Entries */}
            <h3>Time Entries</h3>
            {selectedEmployee.entries.length === 0 ? (
              <p>No time entries found</p>
            ) : (
              <div className="table-responsive">
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
                    {selectedEmployee.entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>{formatDate(entry.clockInTime)}</td>
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
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <strong>Admin Access Code:</strong> 888
        </div>
      </div>
    </div>
  );
}

export default AdminView; 