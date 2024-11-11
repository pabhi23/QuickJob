import React, { useEffect, useState } from 'react';
import './ApplicationHistory.css';

const ApplicationHistory = ({ userId }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplicationHistory = async () => {
      try {
        const response = await fetch(`/api/application-history/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setApplications(data);
        } else {
          console.error('Failed to fetch application history');
        }
      } catch (error) {
        console.error('Error fetching application history:', error);
      }
    };

    fetchApplicationHistory();
  }, [userId]);

  return (
    <div className="application-history">
      <h2>Application History</h2>
      <table className="application-history-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Status</th>
            <th>Applied Date</th>
          </tr>
        </thead>
        <tbody>
          {applications.length > 0 ? (
            applications.map((app) => (
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
  );
};

export default ApplicationHistory;
