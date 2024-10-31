import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApplicationManagement.css';

const ApplicationManagement = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const registerAs = sessionStorage.getItem('registerAs');
    if (registerAs !== 'employer') {
      navigate('/');
    } else {
      fetchApplications();
    }
  }, [navigate]);

  // Fetch applications from the backend
  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:5000/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Handle changing the application status
  const handleStatusChange = async (appId) => {
    const application = applications.find(app => app.id === appId);
    const newStatus = application.status === 'applied' ? 'shortlisted' : 'applied';

    try {
      await fetch(`http://localhost:5000/applications/${appId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      // Update the application status locally
      setApplications((prevApplications) =>
        prevApplications.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Handle viewing application details
  const handleViewDetails = (appId) => {
    console.log(`Viewing details for application ID: ${appId}`);
  };

  return (
    <div className="application-management-container">
      <h2>Application Management</h2>
      <table className="application-table">
        <thead>
          <tr>
            <th>Job Role</th>
            <th>Applicant Name</th>
            <th>Submission Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.jobRole}</td>
              <td>{app.applicantName}</td>
              <td>{app.submissionDate}</td>
              <td>
                <button
                  className={`status-button ${app.status === 'applied' ? 'under-review' : 'reviewed'}`}
                  onClick={() => handleStatusChange(app.id)}
                >
                  {app.status}
                </button>
              </td>
              <td>
                <button className="view-button" onClick={() => handleViewDetails(app.id)}>
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationManagement;
