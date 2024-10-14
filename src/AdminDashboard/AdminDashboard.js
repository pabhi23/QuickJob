import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [jobList, setJobList] = useState([
    {
      id: 1,
      role: 'Backend Developer',
      postingDate: '2024-09-25',
      skills: 'JavaScript, Node.js',
      applicants: 10,
      status: 'Active',
    },
    {
      id: 2,
      role: 'Frontend Developer',
      postingDate: '2024-09-20',
      skills: 'React, CSS',
      applicants: 5,
      status: 'Closed',
    },
    {
      id: 3,
      role: 'Full Stack Developer',
      postingDate: '2024-09-15',
      skills: 'JavaScript, Node.js, React',
      applicants: 8,
      status: 'Active',
    },
  ]);

  const navigate = useNavigate(); 

  useEffect(() => {
    const registerAs = sessionStorage.getItem('registerAs'); 

    if (registerAs !== 'employer') {
      navigate('/'); 
    }
  }, [navigate]);

  const handleModify = (jobId) => {
    console.log(`Modify job with ID: ${jobId}`);
  };

  const handleStatusChange = (jobId) => {
    const updatedList = jobList.map((job) =>
      job.id === jobId ? { ...job, status: job.status === 'Active' ? 'Closed' : 'Active' } : job
    );
    setJobList(updatedList);
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <table className="job-table">
        <thead>
          <tr>
            <th>Job Role</th>
            <th>Job Posting Date</th>
            <th>Skills</th>
            <th>No. of Applicants</th>
            <th>Status</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
          {jobList.map((job) => (
            <tr key={job.id}>
              <td>{job.role}</td>
              <td>{job.postingDate}</td>
              <td>{job.skills}</td>
              <td>{job.applicants}</td>
              <td>
                <button
                  className={`status-button ${job.status === 'Active' ? 'active' : 'closed'}`}
                  onClick={() => handleStatusChange(job.id)}
                >
                  {job.status}
                </button>
              </td>
              <td>
                <button className="modify-button" onClick={() => handleModify(job.id)}>
                  Modify
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
