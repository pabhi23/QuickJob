import React, { useEffect, useState } from 'react';
import './ApplicationHistory.css';

const ApplicationHistory = () => {

  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = 1;
  useEffect(() => {
    fetch(`/api/applications/history/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched application history:', data);
        setApplications(data);
      })
      .catch((error) => {
        console.error('Error fetching application history:', error);
      });
  }, [userId]);
  const filteredApplications = applications.filter(
    (app) =>
      app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="page-container">
    <div className="content-wrap">
    <div className="application-history">
      <h2>Application History</h2>
      <div className="search-bar">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
      <table className="application-history-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Status</th>
            <th>Applied Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <tr key={app.application_id}>
                <td>{app.job_title}</td>
                <td>{app.status}</td>
                <td>{new Date(app.applied_at).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No applications found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
};

export default ApplicationHistory;
