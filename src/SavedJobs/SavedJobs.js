import React, { useEffect, useState } from 'react';
import './SavedJobs.css';

const SavedJobs = ({ userId }) => {
  const [savedJobs, setSavedJobs] = useState([]);
  return (
    <div className="saved-jobs">
      <h2>Saved Jobs</h2>
      {savedJobs.length > 0 ? (
        <ul className="saved-jobs-list">
          {savedJobs.map((job) => (
            <li key={job.job_id} className="saved-job-item">
              <h3>{job.job_title}</h3>
              <p>Category: {job.job_category}</p>
              <p>Location: {job.location}</p>
              <p>Salary Range: {job.salary_range}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved jobs found.</p>
      )}
    </div>
  );
};

export default SavedJobs;