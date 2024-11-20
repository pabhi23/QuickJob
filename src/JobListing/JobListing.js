import React, { useState,useEffect } from 'react';
import './JobListing.css';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const userId = 1;

  useEffect(() => {
    fetch('/api/jobs')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched job data:', data);
        setJobs(data);
      })
      .catch(error => console.error('Error fetching job data:', error));
  }, []);

  // Fetch applied jobs for the user
  useEffect(() => {
    fetch(`/api/applications/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched applied jobs:', data);
        setAppliedJobs(new Set(data)); 
      })
      .catch((error) => console.error('Error fetching applied jobs:', error));
  }, [userId]);

  const handleApply = (jobId) => {
    const userId = 1; 
    const isApplied = appliedJobs.has(jobId); 
  
    if (isApplied) {
      // Unapply logic
      fetch('/api/applications/applied', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId, userId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to unapply for the job');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Unapplied successfully:', data);
          setAppliedJobs((prev) => {
            const updated = new Set(prev);
            updated.delete(jobId); 
            return updated;
          });
        })
        .catch((error) => {
          console.error('Error unapplying for the job:', error);
          alert('An error occurred while unapplying for the job. Please try again later.');
        });
    } else {
      // Apply logic
      fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId, userId }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to apply for the job');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Application successful:', data);
          setAppliedJobs((prev) => new Set(prev).add(jobId)); 
        })
        .catch((error) => {
          console.error('Error applying for the job:', error);
          alert('An error occurred while applying for the job. Please try again later.');
        });
    }
  };  

  const filteredJobs = jobs.filter((job) =>
    job.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.salaryRange.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="job-listing-container">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search for jobs..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="search-input" 
        />
      </div>
      <table className="job-listing-table">
        <thead>
          <tr>
            <th>Job Role</th>
            <th>Skill</th>
            <th>Salary Range</th>
            <th>Apply</th>
          </tr>
        </thead>
        <tbody>
        {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <tr key={job.job_id}>
                <td>{job.jobRole}</td>
                <td>{job.skill}</td>
                <td>{job.salaryRange}</td>
                <td><button className="apply-button" onClick={() => handleApply(job.job_id)}
                  > {appliedJobs.has(job.job_id) ? 'Applied' : 'Apply'}
                </button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No job listings available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JobListing;
