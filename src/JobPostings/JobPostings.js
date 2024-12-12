import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobPostings.css";
import { apiClient } from "../api/apiClient";

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
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const employerId = sessionStorage.getItem("employerId");

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const response = await apiClient.get("/jobs", {
        params: { ...filters },
      });
      setJobs(response.data);
    } catch (error) {
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
      await apiClient.post("/jobs", {
        employer_id: employerId,
        ...newJob,
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
      setAccordionOpen(false);
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await apiClient.delete(`/jobs/${jobId}`);
        fetchJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const categoryInput = document.getElementById("categoryInput").value.trim();
    const locationInput = document.getElementById("locationInput").value.trim();

    setFilters({
      category: categoryInput,
      location: locationInput,
    });
  };

  const handleEditJob = (job) => {
    setEditingJob(job); // Set the job to be edited
    setShowPopup(true); // Show the popup
  };

  const handleUpdateJob = async () => {
    try {
      await apiClient.put(`jobs/${editingJob.job_id}`, {
        ...editingJob,
      });
      fetchJobs();
      setShowPopup(false); // Close the popup
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handlePopupInputChange = (e) => {
    const { name, value } = e.target;
    setEditingJob({ ...editingJob, [name]: value });
  };

  return (
    <div className="job-postings-container">
      <main className="content">
        <div className="accordion">
          <button
            className="accordion-header"
            onClick={() => setAccordionOpen(!accordionOpen)}
          >
            {accordionOpen ? "Close Create Job Form" : "Open Create Job Form"}
          </button>
          {accordionOpen && (
            <div className="accordion-content">
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
          )}
        </div>

        <div className="list-section">
          <h2>Job Postings</h2>
          <form className="filters" onSubmit={handleSearch}>
            <input
              id="categoryInput"
              type="text"
              placeholder="Search by Category"
              defaultValue={filters.category}
            />
            <input
              id="locationInput"
              type="text"
              placeholder="Search by Location"
              defaultValue={filters.location}
            />
            <button type="submit">Search</button>
          </form>
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
                    <button className="btn" onClick={() => handleEditJob(job)}>
                      Edit
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDeleteJob(job.job_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit Job</h2>
            <input
              name="job_title"
              placeholder="Job Title"
              value={editingJob.job_title}
              onChange={handlePopupInputChange}
              required
            />
            <textarea
              name="job_description"
              placeholder="Job Description"
              value={editingJob.job_description}
              onChange={handlePopupInputChange}
              required
            />
            <input
              name="job_category"
              placeholder="Category"
              value={editingJob.job_category}
              onChange={handlePopupInputChange}
            />
            <input
              name="location"
              placeholder="Location"
              value={editingJob.location}
              onChange={handlePopupInputChange}
            />
            <input
              name="salary_range"
              placeholder="Salary Range"
              value={editingJob.salary_range}
              onChange={handlePopupInputChange}
            />
            <textarea
              name="requirements"
              placeholder="Requirements"
              value={editingJob.requirements}
              onChange={handlePopupInputChange}
            />
            <button onClick={handleUpdateJob}>Update Job</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostings;
