import React, { useState } from 'react';
import './JobListing.css';

const JobListing = () => {
  const [jobs, setJobs] = useState([]);

  return (
    <div className="job-listing-container">
      <table className="job-listing-table">
        <thead>
          <tr>
            <th>Job Role</th>
            <th>Skill</th>
            <th>Company Name</th>
            <th>Salary Range</th>
            <th>Apply</th>
          </tr>
        </thead>
        <tbody>
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <tr key={index}>
                <td>{job.jobRole}</td>
                <td>{job.skill}</td>
                <td>{job.companyName}</td>
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
