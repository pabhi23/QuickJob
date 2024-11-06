import React, { useState,useEffect } from 'react';
import './JobListing.css';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  useEffect(() => {
    fetch('/api/jobs')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setJobs(data))
      .catch(error => console.error('Error fetching job data:', error));
  }, []);


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
            filteredJobs.map((job, index) => (
              <tr key={index}>
                <td>{job.jobRole}</td>
                <td>{job.skill}</td>
                <td>{job.salaryRange}</td>
                <td><button className="apply-button">Apply</button></td>
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
