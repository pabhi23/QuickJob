import React, { useEffect, useState } from 'react';
import './SavedJobs.css';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = 1;
  useEffect(() => {
    fetch(`/api/saved-jobs/${userId}`)
      .then((response) => response.json())
      .then((data) => setSavedJobs(data))
      .catch((error) => console.error('Error fetching saved jobs:', error));
  }, [userId]);
  const filteredJobs = savedJobs.filter(
    (job) =>
      job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="page-container">
    <div className="content-wrap">
    <div className="saved-jobs-container">
    <div className="search-bar">
            <input
              type="text"
              placeholder="Search saved jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
      <h2>Saved Jobs</h2>
      {filteredJobs.length > 0 ? (
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
          {filteredJobs.map((job) => (
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