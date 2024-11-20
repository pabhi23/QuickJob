import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobPostings.css";

const JobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    job_title: "",
    job_description: "",
    job_category: "",
    location: "",
    salary_range: "",
    requirements: "",
  });

  const [filters, setFilters] = useState({ category: "", location: "" });
  const employerId = sessionStorage.getItem("employerId");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs", {
        params: { employer_id: employerId, ...filters },
      });
      setJobs(response.data);
    } catch (error) {
      console.log(employerId);

      console.error("Error fetching jobs:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/jobs", {
        ...newJob,
        employer_id: employerId,
      });
      fetchJobs();
      setNewJob({
        job_title: "",
        job_description: "",
        job_category: "",
        location: "",
        salary_range: "",
        requirements: "",
      });
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(http://localhost:5000/api/jobs/${jobId});
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  return (
    <div className="job-postings-grid">
      <div className="form-container">
        <h3>Create Job Posting</h3>
        <form className="job-form" onSubmit={handleCreateJob}>
          <input
            name="job_title"
            placeholder="Job Title"
            value={newJob.job_title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="job_description"
            placeholder="Job Description"
            value={newJob.job_description}
            onChange={handleInputChange}
            required
          />
          <input
            name="job_category"
            placeholder="Category"
            value={newJob.job_category}
            onChange={handleInputChange}
          />
          <input
            name="location"
            placeholder="Location"
            value={newJob.location}
            onChange={handleInputChange}
          />
          <input
            name="salary_range"
            placeholder="Salary Range"
            value={newJob.salary_range}
            onChange={handleInputChange}
          />
          <textarea
            name="requirements"
            placeholder="Requirements"
            value={newJob.requirements}
            onChange={handleInputChange}
          />
          <button type="submit">Create Job</button>
        </form>
      </div>

      <div className="table-container">
        <h3>Job Postings</h3>
        <div className="filters">
          <input
            type="text"
            placeholder="Filter by Category"
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Filter by Location"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          />
          <button onClick={handleSearch}>Search</button>
        </div>

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
            {jobs.map((job) => (
              <tr key={job.job_id}>
                <td>{job.job_title}</td>
                <td>{job.job_category}</td>
                <td>{job.location}</td>
                <td>{job.salary_range}</td>
                <td>
                  <button onClick={() => handleDeleteJob(job.job_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="footer">Copyright 2024. All rights reserved.</div>
    </div>
  );
};

export default JobPostings;