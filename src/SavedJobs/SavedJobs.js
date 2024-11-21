import React, { useEffect, useState } from 'react';
import './SavedJobs.css';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const userId = 1;
  useEffect(() => {
    fetch(`/api/saved-jobs/${userId}`)
      .then((response) => response.json())
      .then((data) => setSavedJobs(data))
      .catch((error) => console.error('Error fetching saved jobs:', error));
  }, [userId]);
  return (
    <div className="page-container">
    <div className="content-wrap">
    <div className="saved-jobs-container">
      <h2>Saved Jobs</h2>
      {savedJobs.length > 0 ? (
        <table className="saved-jobs-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Salary Range</th>
              {/*<th>Action</th>*/}
            </tr>
          </thead>
          <tbody>
          {savedJobs.map((job) => (
            <tr key={job.job_id}>
              <td>{job.job_title}</td>
              <td>{job.job_category}</td>
              <td>{job.location}</td>
              <td>{job.salary_range}</td>
              </tr>
          ))}
        </tbody>
        </table>
      ) : (
        <p>No saved jobs found.</p>
      )}
    </div>
    </div>
    </div>
  );
};
export default SavedJobs;