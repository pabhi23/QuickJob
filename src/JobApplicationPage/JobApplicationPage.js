// JobApplicationPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './JobApplicationPage.css';

const JobApplicationPage = () => {
  const { jobId } = useParams(); // Fetch jobId from the URL params
  const [job, setJob] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicationStatus, setApplicationStatus] = useState('');
  const navigate = useNavigate();

  // Fetch job details when the component mounts
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:5000/jobs/${jobId}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
      }
    };
    fetchJob();
  }, [jobId]);

  // Handle job application submission
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1, // Replace with the actual user ID in a real app
          job_id: jobId,
          status: 'applied',
        }),
      });
      setApplicationStatus('Application submitted successfully!');
      setTimeout(() => navigate('/'), 3000); // Navigate back to homepage after submission
    } catch (error) {
      console.error('Error submitting application:', error);
      setApplicationStatus('Failed to submit application');
    }
  };

  if (!job) return <div>Loading job details...</div>;

  return (
    <div className="job-application-page">
      <h2>{job.job_role}</h2>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Requirements:</strong> {job.requirements}</p>

      <form onSubmit={handleApplicationSubmit} className="application-form">
        <label>
          Name:
          <input
            type="text"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={applicantEmail}
            onChange={(e) => setApplicantEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Apply</button>
      </form>

      {applicationStatus && <p>{applicationStatus}</p>}
    </div>
  );
};

export default JobApplicationPage;
