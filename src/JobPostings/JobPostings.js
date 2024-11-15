import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './JobPostings.css';

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    job_title: '',
    job_description: '',
    job_category: '',
    location: '',
    salary_range: '',
    requirements: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
      fetchJobs(); 
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  }

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/jobs', newJob);
      console.log(response.data.message); 
      
      fetchJobs();

      setNewJob({
        job_title: '',
        job_description: '',
        job_category: '',
        location: '',
        salary_range: '',
        requirements: '',
      });
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div className="job-postings-grid">
      <div className="form-container">
        <h3>Create Job Posting</h3>
        <form className="job-form" onSubmit={handleCreateJob}>
          <input name="job_title" placeholder="Job Title" value={newJob.job_title} onChange={handleInputChange} required />
          <textarea name="job_description" placeholder="Job Description" value={newJob.job_description} onChange={handleInputChange} required />
          <input name="job_category" placeholder="Category" value={newJob.job_category} onChange={handleInputChange} />
          <input name="location" placeholder="Location" value={newJob.location} onChange={handleInputChange} />
          <input name="salary_range" placeholder="Salary Range" value={newJob.salary_range} onChange={handleInputChange} />
          <textarea name="requirements" placeholder="Requirements" value={newJob.requirements} onChange={handleInputChange} />
          <button type="submit">Create Job</button>
        </form>
      </div>

      <div className="table-container">
        <h3>Job Postings</h3>
        <table className="job-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
              <tr>
                <td>Software Engineer</td>
                <td>IT</td>
                <td>Toronto</td>
                <td>70,000- 90,000</td>
                <td>
                  <button className="status-button"> Active</button>
                </td>
              </tr>
              <tr>
                <td>Product Manager</td>
                <td>Management</td>
                <td>Vancouver</td>
                <td>80,000- 1,00,000</td>
                <td>
                  <button className="status-button"> Active</button>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobPostings;
