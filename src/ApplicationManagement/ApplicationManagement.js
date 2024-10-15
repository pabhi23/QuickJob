import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApplicationManagement.css';

const ApplicationManagement = () => {
  // Initial state for applications
  const [applications, setApplications] = useState([
    {
      id: 1,
      jobRole: 'Backend Developer',
      applicantName: 'John Doe',
      submissionDate: '2024-10-01',
      status: 'Under Review',
    },
    {
      id: 2,
      jobRole: 'Frontend Developer',
      applicantName: 'Jane Smith',
      submissionDate: '2024-09-28',
      status: 'Reviewed',
    },
    {
      id: 3,
      jobRole: 'Full Stack Developer',
      applicantName: 'David Johnson',
      submissionDate: '2024-09-20',
      status: 'Under Review',
    },
  ]);

  const navigate = useNavigate();

  // Check if the user is logged in and is an employer
  useEffect(() => {
    const registerAs = sessionStorage.getItem('registerAs');
    if (registerAs !== 'employer') {
      navigate('/');
    }
  }, [navigate]);

  // Handle changing the application status
  const handleStatusChange = (appId) => {
    const updatedApplications = applications.map((app) =>
      app.id === appId ? { ...app, status: app.status === 'Under Review' ? 'Reviewed' : 'Under Review' } : app
    );
    setApplications(updatedApplications);
  };

  // Handle viewing application details
  const handleViewDetails = (appId) => {
    console.log(`Viewing details for application ID: ${appId}`);
    // Here you can navigate to a detailed page or open a modal with more information
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
                  className={`status-button ${app.status === 'Under Review' ? 'under-review' : 'reviewed'}`}
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
