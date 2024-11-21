import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobSearch.css";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ category: "", location: "" });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs", {
        params: { ...filters },
      });
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
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

  const handleClearFilters = () => {
    setFilters({ category: "", location: "" });
    document.getElementById("categoryInput").value = "";
    document.getElementById("locationInput").value = "";
  };

  const handleApply = (jobId) => {
    alert(`Applied for Job ID: ${jobId}`);
    // Implement further job application logic here, such as API calls.
  };

  return (
    <div className="job-postings-container">
      <main className="content">
        <div className="list-section">
          <h2>Job Search</h2>
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
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                marginLeft: "10px",
                padding: "10px 20px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </form>

          <div className="job-cards-container">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div className="job-card" key={job.job_id}>
                  <h3 className="job-title">{job.job_title}</h3>
                  <p className="job-category">
                    <strong>Category:</strong> {job.job_category}
                  </p>
                  <p className="job-location">
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p className="job-salary">
                    <strong>Salary:</strong> {job.salary_range}
                  </p>
                  <button
                    className="apply-button"
                    onClick={() => handleApply(job.job_id)}
                  >
                    Apply
                  </button>
                </div>
              ))
            ) : (
              <p>No jobs found matching your criteria.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSearch;
